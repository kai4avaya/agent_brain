
import { XenovaEmbedding } from './xenova-embedding';


export async function calculateScores(query) {
    const xenovaEmbedding = new XenovaEmbedding();
    const queryVector = await xenovaEmbedding.getQueryEmbedding(query);

    const scores = Object.keys(vectorDict).map((docId) => {
        const docVectorData = vectorDict[docId].data;
        const docVector = Object.keys(docVectorData).map(key => docVectorData[key]);
        const similarity = cosineSimilarity(queryVector, docVector);
        return { docId, similarity };
    });

    return scores;
}

function dotProduct(vecA, vecB) {
    return vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
}

function magnitude(vec) {
    return Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
}

function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}