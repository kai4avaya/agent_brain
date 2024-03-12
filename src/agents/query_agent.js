import {
    OpenAIAgent,
    // SimpleDirectoryReader,
    // VectorStoreIndex,
    // QueryEngineTool,
  } from "llamaindex";
  // import { stdin as input, stdout as output } from "node:process";
// import readline from "node:readline/promises";
  // import('dotenv/config');

  import dotenv from 'dotenv';
// import { cat } from "@xenova/transformers";
dotenv.config();


  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.");
    process.exit(1); // Exit the application if the key is not set
  }

  export async function query_agent(queryEngineTool, query) {
    // Load the documents
    // const documents = await new SimpleDirectoryReader().loadData({
    //   directoryPath: "node_modules/llamaindex/examples/",
    // });
  
    // // Create a vector index from the documents
    // const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
  
    // Create a query engine from the vector index
    // const contactCenterQueryEngine = vectorIndex.asQueryEngine();
  
    // // Create a QueryEngineTool with the query engine
    // const queryEngineTool = new QueryEngineTool({
    //   queryEngine: contactCenterQueryEngine,
    //   metadata: {
    //     name: "contact center query engine",
    //     description: "A query engine to help contact center agents find information for customers.",
    //   },
    // });
  
    // Create an OpenAIAgent with the function tools
    // const agent = new OpenAIAgent({
    //   tools: [queryEngineTool],
    //   verbose: true,
    // });
    let response;
    try {
    const agent = new OpenAIAgent({
      tools: [queryEngineTool],
      verbose: true,
      apiKey: process.env.OPENAI_API_KEY, // This line is hypothetical and depends on the library's API
    });
  
    console.log("I AM QUERYING", query)
    // Chat with the agent
     response = await agent.chat({
      message: query,
    });
  }
  catch (error) {
    response = error;
    console.error("Error querying the agent", error);
  }

    return response
    
  }
  
  // https://ts.llamaindex.ai/examples/chat_engine

  const prompt = `you are an agent assisting a contact center customer. Use the provided information from the database to answer the customer's query. `

  export async function query_retriever_agent(chatEngine, query) {
    const stream = chatEngine.chat({ message: prompt + `Customers query : ` +  query, stream: true });
    return stream;
  }