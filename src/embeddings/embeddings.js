import { pipeline, env } from '@xenova/transformers';

export default class XenovaEmbedding {
    constructor() {
        if (typeof process === 'undefined') {
            env.allowLocalModels = false;
            env.backends.onnx.wasm.numThreads = 1;
        }

        this.pipelineInstance = null;
    }

    async initialize() {
        if (!this.pipelineInstance) {
            this.pipelineInstance = await pipeline("feature-extraction", "Supabase/gte-small");
        }
    }

    // Method to get embeddings for a single text
    async getTextEmbedding(text) {
        await this.initialize(); // Ensure the pipeline is ready
        const embedding = await this.pipelineInstance(text, {
            pooling: "mean",
            normalize: true,
        });
        
        // console.log("i am embedding for", text, "and the embedding is", embedding)
        // return embedding;
        
        // Convert the Float32Array to a normal array
        const embeddingsArray = Array.from(embedding.data);

        // Alternatively, using the spread operator
        // const embeddingsArray = [...embeddings.data];

        // console.log("embeddings", embeddingsArray);
        return embeddingsArray;
    }

    // Method specifically for getting embeddings for a query
    async getQueryEmbedding(query) {
        await this.initialize(); // Ensure the pipeline is initialized
        const embedding = await this.pipelineInstance(query, {
            pooling: "mean",
            normalize: true,
        });
        // console.log("i am embedding for", query, "and the embedding is", embedding)
        
        // return embedding;
        // Convert the Float32Array to a normal array
        const embeddingsArray = Array.from(embedding.data);

        // Alternatively, using the spread operator
        // const embeddingsArray = [...embeddings.data];

        // console.log("embeddings", embeddingsArray);
        return embeddingsArray;
    }

    // Optional: Implement the batch processing method if needed
    async getTextEmbeddings(texts) {
        await this.initialize(); // Ensure the pipeline is ready
        const embeddings = await Promise.all(texts.map(text => 
            this.pipelineInstance(text, {
                pooling: "mean",
                normalize: true,
            })
        ));

        // return embeddings;
        // Convert the Float32Array to a normal array
        const embeddingsArrays = Array.from(embeddings.data);

        // Alternatively, using the spread operator
        // const embeddingsArray = [...embeddings.data];

        // console.log("embeddings", embeddingsArrays);
        return embeddingsArrays;
    }
}