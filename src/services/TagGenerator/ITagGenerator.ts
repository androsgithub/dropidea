export default interface ITagGenerator {
  options: ITagGeneratorOptions | undefined;
  generateTags(content: string): Promise<string[]>;
}

export type ITagGeneratorOptions = {
  apiKey?: string;
  config?: SDKConfig;
};

export interface Document {
  content: string;
  category: string;
}

export interface TfIdfScore {
  word: string;
  tf: number;
  idf: number;
  tfIdf: number;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  scores: TfIdfScore[];
  matchedWords: string[];
}

export interface SDKConfig {
  removeStopWords?: boolean;
  stemming?: boolean;
  minWordLength?: number;
  maxResults?: number;
  confidenceThreshold?: number;
  caseSensitive?: boolean;
}
