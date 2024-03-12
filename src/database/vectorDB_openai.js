// Import necessary components from LlamaIndex and OpenAI SDK
import { config } from "dotenv";
config();
import {
  Document,
  VectorIndexRetriever,
  VectorStoreIndex,
  storageContextFromDefaults,
  serviceContextFromDefaults,
  OpenAIEmbedding,
} from "llamaindex";
// import {
//     ,
//     SimilarityPostprocessor
//   } from "llamaindex";
import OpenAI from "openai";
import essay from "./essay.js";

// Example essay text for demonstration
// const essay = "This is a sample essay text to be indexed.";

// Assuming your OpenAI API key is set in environment variables for security
const openAIApiKey = process.env.OPENAI_API_KEY;

// Initialize OpenAI SDK with your API key
const openai = new OpenAI({ apiKey: openAIApiKey });

// Create an OpenAIEmbedding instance and pass the OpenAI instance
const openaiEmbedModel = new OpenAIEmbedding({ apiKey: openAIApiKey });

// Create a serviceContext using the OpenAI embedding model
const serviceContext = serviceContextFromDefaults({
  embedModel: openaiEmbedModel,
});

// Use storageContextFromDefaults to define where to persist the index
const storageContext = await storageContextFromDefaults({
  persistDir: "./storage_openai", // Specify your storage directory
});

// Create Document object with your content
const document = new Document({ text: essay, id_: "essay" });

// Initialize VectorStoreIndex with your document and serviceContext
const index = await VectorStoreIndex.fromDocuments([document], {
  storageContext,
  serviceContext,
});

openai.embeddings
  .create({
    model: "text-embedding-ada-002", // Example model, replace with your actual model
    input: essay, // Your essay text
  })
  .then((embeddingResponse) => {
    console.log("TESSSSTTTT  Embeddings:", embeddingResponse.data);
    // Continue with the rest of your code here
  });
// console.log("index", index);

// Access the vector store and its data
// const vectorStoreData = index.vectorStore.data;

// // Access the embeddings dictionary
// const embeddingsDict = vectorStoreData.embeddingDict;

// // Log the embeddings dictionary or specific embeddings
// console.log("Embeddings Dictionary:", embeddingsDict);

// Initialize a query engine with the index
const queryEngine = index.asQueryEngine();

// Define your query
const query = "What is the meaning of life?";

// Execute the query
const results = await queryEngine.query({
  query,
});

// Handle the results
console.log("Query Results:", results);

console.log("----------------------------------------------------------------");

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
console.log("----------------------------------------------------------------");
