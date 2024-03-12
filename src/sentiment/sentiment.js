import { pipeline } from '@xenova/transformers';

class SentimentAnalyzer {
  constructor() {
    if (!SentimentAnalyzer.instance) {
      this.pipe = null;
      SentimentAnalyzer.instance = this;
    }

    return SentimentAnalyzer.instance;
  }

  async loadPipeline() {
    if (!this.pipe) {
      this.pipe = await pipeline('sentiment-analysis');
    }
  }

  async analyzeSentiment(text) {
    if (!this.pipe) {
      await this.loadPipeline();
    }
    return await this.pipe(text);
  }
}

const sentimentAnalyzer = new SentimentAnalyzer();

// Usage
// Initialize and analyze sentiment
// (async () => {
//   let out = await sentimentAnalyzer.analyzeSentiment('I love transformers!');
//   console.log(out);
//   // [{'label': 'POSITIVE', 'score': 0.999817686}]
// })();