import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
  serviceContextFromDefaults,
  QueryEngineTool,
  ContextChatEngine,
} from "llamaindex";
import XenovaEmbedding from "../embeddings/embeddings.js";
import fs from "fs";
import path from "path";

class DummyLLM {
  async complete(params) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("DummyLLM complete called with params:", params);
    return {
      text: "This is a dummy response.",
    };
  }
}

class Database {
  constructor(persistDir = "./storage_xenova") {
    this.persistDir = persistDir;
    this.xenovaEmbeds = new XenovaEmbedding();
    this.serviceContext = serviceContextFromDefaults({
      llm: new DummyLLM(),
      embedModel: this.xenovaEmbeds,
    });
  }

  async init() {
    this.storageContext = await storageContextFromDefaults({
      persistDir: this.persistDir,
    });

    try {
      this.index = await VectorStoreIndex.init({
        storageContext: this.storageContext,
        serviceContext: this.serviceContext,
      })

    } catch (error) {
      console.log("No valid data found, initializing with a dummy document");
      const dummyDocument = { text: "", id_: "dummy" };
      await this.insertDocuments([dummyDocument]);
    }

    try {
      await this.buildEngine();
    }
    catch (error) {
      console.error("Error building the query engine", error);
    }
  }

  async buildEngine() {
    const contactCenterQueryEngine = this.index.asQueryEngine();
  
    // Create a QueryEngineTool with the query engine
    const queryEngineTool = new QueryEngineTool({
      queryEngine: contactCenterQueryEngine,
      metadata: {
        name: "contact-center-query-engine",
        description: "A query engine to help contact center agents find information for customers.",
      },

      
    });

    this.queryEngineTools = queryEngineTool;

    const retriever = this.index.asRetriever();
      retriever.similarityTopK = 1;
      const chatEngine = new ContextChatEngine({ retriever });
      this.chatEngine = chatEngine;
  
  }
  async insertDocuments(documents) {
    console.log("i am documents", documents)
    const docs = documents.map((doc) => new Document(doc));
    this.index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: this.storageContext,
      serviceContext: this.serviceContext,
    });
  }

  async query(query) {
    const queryEngine = this.index.asQueryEngine();
    return await queryEngine.query({ query });
  }



  // Improved delete document method
  async deleteDocument(id) {
    // Assuming id is the reference document ID
    if (this.index.deleteRefDoc) {
      await this.index.deleteRefDoc(id);
      console.log(`Document with ID ${id} has been deleted.`);
    } else {
      console.log("Delete operation is not supported.");
    }
  }

  deleteAllDocuments() {
    fs.readdir(this.persistDir, (err, files) => {
      if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
      }

      files.forEach((file) => {
        const filePath = path.join(this.persistDir, file);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error("Error deleting file", filePath, error);
          } else {
            console.log("Deleted file", filePath);
          }
        });
      });
    });
  }
}

export default Database;
