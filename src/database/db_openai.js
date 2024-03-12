import { config } from "dotenv";
config();
import fs from 'fs';
import path from 'path';
import {
  Document,
  VectorStoreIndex,
  storageContextFromDefaults,
  serviceContextFromDefaults,
  OpenAIEmbedding,
} from "llamaindex";
import OpenAI from "openai";

class Database {
  constructor(persistDir = "./storage_openai") {
    this.persistDir = persistDir;
    this.openAIApiKey = process.env.OPENAI_API_KEY;
    this.openai = new OpenAI({ apiKey: this.openAIApiKey });
    this.openaiEmbedModel = new OpenAIEmbedding({ apiKey: this.openAIApiKey });
    this.serviceContext = serviceContextFromDefaults({
      embedModel: this.openaiEmbedModel,
    });
    this.storageContext = null;
    this.index = null;
  }

  async init() {
    this.storageContext = await storageContextFromDefaults({
      persistDir: this.persistDir,
    });

    try {
      this.index = await VectorStoreIndex.init({
        storageContext: this.storageContext,
        serviceContext: this.serviceContext,
      });
    } catch (error) {
      console.log("No valid data found, initializing with a dummy document");
      const dummyDocument = { text: "", id_: "dummy" };
      await this.insertDocuments([dummyDocument]);
    }
  }

  async query(query) {
    const queryEngine = this.index.asQueryEngine();
    return await queryEngine.query({ query });
  }

  async insertDocuments(documents) {
    const docs = documents.map((doc) => new Document(doc));
    this.index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: this.storageContext,
      serviceContext: this.serviceContext,
    });
  }

  async deleteAllDocuments() {
    fs.readdir(this.persistDir, (err, files) => {
      if (err) {
        console.error("Could not list the directory.", err);
        return;
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

  // Method to add other functionalities like insertDocuments, query, etc.
}

export default Database;
