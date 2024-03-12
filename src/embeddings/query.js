import { OpenAIEmbedding, serviceContextFromDefaults } from "llamaindex";
import {embed} from './embed'
const openaiEmbedModel = new OpenAIEmbedding();

const serviceContext = serviceContextFromDefaults({
  embedModel: openaiEmbedModel,
});

const document = new Document({ text: essay, id_: "essay" });

const index = await VectorStoreIndex.fromDocuments([document], {
  serviceContext,
});

const queryEngine = index.asQueryEngine();

const query = "What is the meaning of life?";

const results = await queryEngine.query({
  query,
});