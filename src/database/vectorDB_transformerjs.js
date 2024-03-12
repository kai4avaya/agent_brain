import {
  Document,
  storageContextFromDefaults,
  VectorStoreIndex,
  VectorIndexRetriever,
  serviceContextFromDefaults, // Make sure to import this function
  SimilarityPostprocessor,
} from "llamaindex";
import essay from "./essay.js";
import XenovaEmbedding from "../embeddings/embeddings.js";

// Dummy implementation for LLM if necessary
class DummyLLM {
  async complete(params) {
    // Simulate processing delay if needed
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100 ms delay

    // Log the input parameters for debugging purposes
    console.log("DummyLLM complete called with params:", params);

    // Return a dummy response structure. Adjust the structure to fit your application's expectations.
    // This example assumes the caller expects a response object with a 'text' property.
    return {
      text: "This is a dummy response.",
    };
  }
}

async function main() {
  // Create Document object with essay
  const document = new Document({ text: essay, id_: "essay" });

  // Instantiate XenovaEmbedding
  const xenovaEmbeds = new XenovaEmbedding();

  // Create a serviceContext with XenovaEmbedding
  const serviceContext = serviceContextFromDefaults({
    llm: new DummyLLM(), // Use null or a dummy class if LLM is not used
    embedModel: xenovaEmbeds,
  });

  // Use storageContextFromDefaults to define where to persist the index
  const storageContext = await storageContextFromDefaults({
    persistDir: "./storage_xenova", // Specify your storage directory
  });

  // Ensure to pass the serviceContext when creating the VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document], {
    storageContext,
    serviceContext, // Pass the custom serviceContext here
  });

  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query({
    query: "What did the author do in college?",
  });

  // Output response
  // console.log(response.toString());

  // Load the index (if needed, show how to use the same serviceContext with a loaded index)
  // const loadedIndex = await VectorStoreIndex.init({
  //   storageContext: storageContext, // Reuse the same storageContext for loading
  //   serviceContext, // Ensure to pass the same serviceContext when initializing the index
  // });
  // const loadedQueryEngine = loadedIndex.asQueryEngine();
  // const loadedResponse = await loadedQueryEngine.query({
  //   query: "What did the author do growing up?",
  // });
  // console.log(loadedResponse.toString());

  console.log(
    "----------------------------------------------------------------"
  );

  const nodes = await index
    .asRetriever()
    .retrieve("Nietzsche  discusses how writing is  autobiographical");
  const retriever = index.asRetriever();
  retriever.similarityTopK = 3;

  // Fetch nodes!
  const nodesWithScore = await retriever.retrieve(
    "Nietzsche  discusses how writing is  autobiographical"
  );
  console.log("nodesWithScore", nodesWithScore, nodesWithScore.toString());

  const vectorIndexRetriever = new VectorIndexRetriever({
    index,
    similarityTopK: 5,
    imageSimilarityTopK: 2,
  });

  const vr = await vectorIndexRetriever.retrieve(
    "Nietzsche  discusses how writing is  autobiographical"
  );
  console.log("VRRRRRRRR", vr, vr.toString());
  console.log(
    "----------------------------------------------------------------"
  );

  //   console.log("nodes",nodes, nodes.toString())
  const processor = new SimilarityPostprocessor({
    similarityCutoff: 0.7,
  });

  const filteredNodes = processor.postprocessNodes(nodes);

  console.log("filteredNodes", filteredNodes, filteredNodes.toString());
}

main().catch(console.error);
