// import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
// import { VectorStoreRetrieverMemory } from "langchain/memory";
// import { LLMChain } from "langchain/chains";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import dotenv from 'dotenv';
// dotenv.config();
// console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY)
// const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings(
//     {
//         apiKey: process.env.OPENAI_API_KEY,
//     }
// ));

// const parser = new StringOutputParser();
// const memory = new VectorStoreRetrieverMemory({
//   // 1 is how many documents to return, you might want to return more, eg. 4
//   vectorStoreRetriever: vectorStore.asRetriever(1),
//   memoryKey: "history",
// });


// // First let's save some information to memory, as it would happen when
// // used inside a chain.
// // await memory.saveContext(
// //   { input: "My favorite food is pizza" },
// //   { output: "thats good to know" }
// // );
// // console.log("dog2")

// await memory.saveContext(
//   { input: "My favorite sport is soccer" },
//   { output: "..." }
// );
// // await memory.saveContext({ input: "I don't the Celtics" }, { output: "ok" });

// // Now let's use the memory to retrieve the information we saved.

// /*
// { history: 'input: My favorite sport is soccer\noutput: ...' }
// */

// // Now let's use it in a chain.
// const model = new OpenAI({ 
//     apiKey: process.env.OPENAI_API_KEY,
//     temperature: 0.9 });

// async function mem_chat(query) {



// const {role, traits, pre_query, quote} = query

//     // ???
//     // console.log(
//     //     await memory.loadMemoryVariables({ prompt: `You are a ${role} with the following traits:
//     //    ${traits}, where a score of 1 is lowest and 5 is highest. Respond as this role and using these traits.
//     //    `})
//     //   );

//         console.log(
//         await memory.loadMemoryVariables({ prompt:"favorite food"}
//       ))

// const prompt =
//   PromptTemplate.fromTemplate(`The following is a  conversation between a human and an AI. The AI is a ${role} who has the following traits ${traits}, where a score of 1 is lowest and 5 is highest. If the AI does not know the answer to a question, it truthfully says it does not know.

// Relevant pieces of previous conversation:
// {history}

// (You do not need to use these pieces of information if not relevant)

// Current conversation:
// Human: {input}
// AI:`);
// const chain = new LLMChain({ llm: model, prompt, memory }).pipe(parser)

// console.log(prompt)
// // const chain = prompt.pipe(model).pipe(parser);

// const input = pre_query + ' quote: ' + quote;

// console.log(input)
// const stream = await chain.stream({ input: input });

// let all_mem = []

// for await (const chunk of stream) {
//     console.log(`${chunk}|`);
//     all_mem.push(chunk)
//   }

// await memory.saveContext(
//     { input: input},
//     { output: all_mem.join(" ")},
//   );

// }
// /*
// {
//   res1: {
//     text: " Hi Perry, I'm doing great! I'm currently exploring different topics related to artificial intelligence like natural language processing and machine learning. What about you? What have you been up to lately?"
//   }
// }
// */

// // const res2 = await chain.call({ input: "what's my favorite sport?" });
// // console.log({ res2 });
// // /*
// // { res2: { text: ' You said your favorite sport is soccer.' } }
// // */

// // const res3 = await chain.call({ input: "what's my name?" });
// // console.log({ res3 });
// // /*
// // { res3: { text: ' Your name is Perry.' } }
// // */

// const quote = `The factTail function multiplies x with the current accumulator before entering the recursive call.

// Although most of the time we prefer to use head recursion because it’s simpler and easy to understand, the tail recursion can give us an advantage in memory. That’s the reason we have a term called Tail Call Optimization (TCO).`


// const query = `summarize this for an 8th grader: `

// const role = 'professor'

// const traits = {"patience": 5}

// const total_prompt = {role, traits, query, quote}

// mem_chat(total_prompt)

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";


const prompt2 = ChatPromptTemplate.fromTemplate("Tell me a joke about {topic}");


import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
import { StringOutputParser } from "@langchain/core/output_parsers";
dotenv.config();
console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY)
const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings(
    {
        apiKey: process.env.OPENAI_API_KEY,
    }
));

const parser = new StringOutputParser();


const memory = new VectorStoreRetrieverMemory({
  // 1 is how many documents to return, you might want to return more, eg. 4
  vectorStoreRetriever: vectorStore.asRetriever(1),
  memoryKey: "history",
});


// First let's save some information to memory, as it would happen when
// used inside a chain.
await memory.saveContext(
  { input: "My favorite food is pizza" },
  { output: "thats good to know" }
);
await memory.saveContext(
  { input: "My favorite sport is soccer" },
  { output: "..." }
);
await memory.saveContext({ input: "I don't the Celtics" }, { output: "ok" });

// Now let's use the memory to retrieve the information we saved.
console.log(
  await memory.loadMemoryVariables({ prompt: "what sport should i watch?" })
);
{ history: 'input: My favorite sport is soccer\noutput: ...' }

// Now let's use it in a chain.
const model = new OpenAI({  apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9 });
const prompt =
  PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Relevant pieces of previous conversation:
{history}

(You do not need to use these pieces of information if not relevant)

Current conversation:
Human: {input}
AI:`);
// const chain = new LLMChain({ llm: model, prompt, memory });
// const chain = new LLMChain({ llm: model, prompt, memory})//.pipe(parser)


// const res1 = await chain.call({ input: "Hi, my name is Perry, what's up?" });
// console.log({ res1 });

// const stream = await chain.stream({ input: "tell me more about your favorite food" });

// let all_mem = []

// for await (const chunk of stream) {
//     console.log(`${chunk}|`);
//     all_mem.push(chunk)
//   }

//   const prompt2 = ChatPromptTemplate.fromTemplate("Tee a joke about {topic}");
  const model2 = new ChatOpenAI({apiKey: process.env.OPENAI_API_KEY});
  const parser2 = new StringOutputParser();
  const chain2 = prompt2.pipe(model2).pipe(parser2);
  
  const stream2 = await chain2.stream({
    topic: "parrot",
  });
  
  for await (const chunk of stream2) {
    console.log(`${chunk}|`);
  }

  

import {
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

// Instantiate your model and prompt.
const prompt3 = ChatPromptTemplate.fromMessages([
  ["ai", "You are a helpful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// Create a simple runnable which just chains the prompt to the model.
const runnable = prompt3.pipe(model2);

// Define your session history store.
// This is where you will store your chat history.
const messageHistory = new ChatMessageHistory();

// Create your `RunnableWithMessageHistory` object, passing in the
// runnable created above.
const withHistory = new RunnableWithMessageHistory({
  runnable,
  // Optionally, you can use a function which tracks history by session ID.
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  // This shows the runnable where to insert the history.
  // We set to "history" here because of our MessagesPlaceholder above.
  historyMessagesKey: "history",
});

// Create your `configurable` object. This is where you pass in the
// `sessionId` which is used to identify chat sessions in your message store.
const config = { configurable: { sessionId: "1" } };

// Pass in your question, in this example we set the input key
// to be "input" so we need to pass an object with an "input" key.
let output = await withHistory.invoke(
  { input: "Hello there, I'm Archibald!" },
  config
);
console.log("output 1:", output);
/**
output 1: AIMessage {
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: 'Hello, Archibald! How can I assist you today?',
  additional_kwargs: { function_call: undefined, tool_calls: undefined }
}
 */

output = await withHistory.invoke({ input: "What's my name?" }, config);
console.log("output 2:", output);
/**
output 2: AIMessage {
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: 'Your name is Archibald, as you mentioned earlier. Is there anything specific you would like assistance with, Archibald?',
  additional_kwargs: { function_call: undefined, tool_calls: undefined }
}
 */

/**
 * You can see the LangSmith traces here:
 * output 1 @link https://smith.langchain.com/public/686f061e-bef4-4b0d-a4fa-04c107b6db98/r
 * output 2 @link https://smith.langchain.com/public/c30ba77b-c2f4-440d-a54b-f368ced6467a/r
 */

// const chain2 = prompt2.pipe(model2).pipe(parser2);
  
// const stream2 = await chain2.stream({
//   topic: "parrot",
// });

// for await (const chunk of stream2) {
//   console.log(`${chunk}|`);
// }

// THIIIISSSSSSSSSSSSS ONEEEEEEEEEEEEEEEEEE!!!!
// const newHist = withHistory.pipe(parser2);
const chain4 = prompt3.pipe(model2).pipe(parser2);

const withHistory2 = new RunnableWithMessageHistory({
    runnable: chain4,
    // Optionally, you can use a function which tracks history by session ID.
    getMessageHistory: (_sessionId) => messageHistory,
    inputMessagesKey: "input",
    // This shows the runnable where to insert the history.
    // We set to "history" here because of our MessagesPlaceholder above.
    historyMessagesKey: "history",
  });

const stream4 = await withHistory2.stream({ input: "What's my name?" }, config)
  
  
  for await (const chunk of stream4) {
    console.log(`${chunk}|`);
  }
