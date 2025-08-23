import BASE_DOCUMENTS from '../../assets/base_documents.json';
import STOP_WORDS from '../../assets/stop_words.json';
import type ITagGenerator from './ITagGenerator';
import type { ClassificationResult, Document, ITagGeneratorOptions, SDKConfig, TfIdfScore } from './ITagGenerator';

export class TagGeneratorLocal implements ITagGenerator {
  options: ITagGeneratorOptions | undefined;
  constructor(options: ITagGeneratorOptions) {
    this.options = options;
  }
  async generateTags(content: string): Promise<string[]> {
    const tf = new TfIdfSDK(this.options?.config);
    const tags = tf.classify(content).map((tag) => tag.category);
    return tags;
  }
}

export class TfIdfSDK {
  private documents: Document[] = [];
  private config: Required<SDKConfig>;
  private wordIdfCache: Map<string, number> = new Map();
  private stopWordsSet: Set<string>;
  constructor(config: SDKConfig = {}) {
    this.config = {
      removeStopWords: config.removeStopWords ?? true,
      stemming: config.stemming ?? false,
      minWordLength: config.minWordLength ?? 2,
      maxResults: config.maxResults ?? 5,
      confidenceThreshold: config.confidenceThreshold ?? 0.01,
      caseSensitive: config.caseSensitive ?? false
    };
    this.stopWordsSet = new Set(STOP_WORDS.map((w) => (this.config.caseSensitive ? w : w.toLowerCase())));
    this.loadBaseDocuments();
  }
  /** * Carrega a base de dados padrão com mais de 100 documentos */
  private loadBaseDocuments(): void {
    this.documents = [...BASE_DOCUMENTS];
    this.clearCache();
  }
  /** * Adiciona um novo documento à base */ public addDocument(document: Document): void {
    this.documents.push(document);
    this.clearCache();
  }
  /** * Adiciona múltiplos documentos */ public addDocuments(documents: Document[]): void {
    this.documents.push(...documents);
    this.clearCache();
  }
  /** * Remove um documento da base */ public removeDocument(category: string): boolean {
    const initialLength = this.documents.length;
    this.documents = this.documents.filter((doc) => doc.category !== category);
    if (this.documents.length < initialLength) {
      this.clearCache();
      return true;
    }
    return false;
  }
  /** * Limpa o cache de IDF */
  private clearCache(): void {
    this.wordIdfCache.clear();
  }
  /** * Pré-processa o texto */
  private preprocessText(text: string): string[] {
    const processedText = this.config.caseSensitive ? text : text.toLowerCase();
    // Remove pontuação e divide em palavras
    const words = processedText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= this.config.minWordLength);
    // Remove stop words se configurado

    if (this.config.removeStopWords) {
      return words.filter((word) => !this.stopWordsSet.has(word));
    }
    return words;
  }
  /** * Calcula Term Frequency (TF) */
  private calculateTF(word: string, document: Document): number {
    const words = this.preprocessText(document.content);
    console.log(words);
    const wordCount = words.filter((w) => w === word).length;
    return words.length > 0 ? wordCount / words.length : 0;
  }
  /** * Calcula Inverse Document Frequency (IDF) com cache */ private calculateIDF(word: string): number {
    if (this.wordIdfCache.has(word)) {
      return this.wordIdfCache.get(word)!;
    }
    const docsWithWord = this.documents.filter((doc) => this.preprocessText(doc.content).includes(word)).length;
    const idf = docsWithWord > 0 ? Math.log(this.documents.length / docsWithWord) : 0;
    this.wordIdfCache.set(word, idf);
    return idf;
  }
  /** * Calcula TF-IDF para uma palavra em um documento */
  private calculateTfIdf(word: string, document: Document): number {
    const tf = this.calculateTF(word, document);
    const idf = this.calculateIDF(word);
    return tf * idf;
  }
  /** * Obtém scores TF-IDF detalhados para um documento */
  public getDocumentScores(documentContent: string): TfIdfScore[] {
    const words = [...new Set(this.preprocessText(documentContent))];
    const tempDoc: Document = { content: documentContent, category: 'temp' };
    return words
      .map((word) => ({
        word,
        tf: this.calculateTF(word, tempDoc),
        idf: this.calculateIDF(word),
        tfIdf: this.calculateTfIdf(word, tempDoc)
      }))
      .sort((a, b) => b.tfIdf - a.tfIdf);
  }
  /** * Classifica um texto nas categorias disponíveis */
  public classify(text: string): ClassificationResult[] {
    const words = this.preprocessText(text);
    const tempDoc: Document = { content: text, category: 'input' };
    // Agrupa documentos por categoria
    const categories = [...new Set(this.documents.map((doc) => doc.category))];
    const categoryScores = categories.map((category) => {
      const categoryDocs = this.documents.filter((doc) => doc.category === category);
      // Calcula score médio da categoria
      const totalScore = categoryDocs.reduce((sum, doc) => {
        const docScore = words.reduce((wordSum, word) => {
          return wordSum + this.calculateTfIdf(word, doc);
        }, 0);
        return sum + docScore;
      }, 0);

      const averageScore = totalScore / categoryDocs.length;
      // Encontra palavras que mais contribuíram
      const wordScores = words
        .map((word) => ({
          word,
          tf: this.calculateTF(word, tempDoc),
          idf: this.calculateIDF(word),
          tfIdf: this.calculateTfIdf(word, tempDoc)
        }))
        .filter((score) => score.tfIdf > this.config.confidenceThreshold)
        .sort((a, b) => b.tfIdf - a.tfIdf);
      return {
        category,
        confidence: Math.max(0, Math.min(1, averageScore / words.length)),
        scores: wordScores,
        matchedWords: wordScores.map((s) => s.word)
      };
    });
    console.log(categoryScores);
    return categoryScores
      .filter((result) => result.confidence >= this.config.confidenceThreshold)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, this.config.maxResults);
  }
  /** * Busca documentos similares */
  public findSimilar(text: string, maxResults?: number): Array<{ document: Document; similarity: number }> {
    const limit = maxResults || this.config.maxResults;
    const searchWords = this.preprocessText(text);
    const similarities = this.documents.map((doc) => {
      const docWords = this.preprocessText(doc.content);
      // Calcula similaridade baseada em TF-IDF (cosine-like simplificado)
      const numerator = searchWords.reduce((sum, word) => {
        if (docWords.includes(word)) {
          return sum + this.calculateTfIdf(word, doc);
        }
        return sum;
      }, 0);
      // Normalização simples pelo tamanho do documento + input
      const denominator = Math.sqrt(searchWords.length * docWords.length);
      const similarity = denominator > 0 ? numerator / denominator : 0;
      return { document: doc, similarity };
    });
    return similarities
      .filter((s) => s.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
  /** * Retorna estatísticas gerais da base de documentos */
  public getStats() {
    const totalDocs = this.documents.length;
    const categories = [...new Set(this.documents.map((d) => d.category))];
    const docsByCategory = categories.reduce(
      (acc, cat) => {
        acc[cat] = this.documents.filter((d) => d.category === cat).length;
        return acc;
      },
      {} as Record<string, number>
    );
    return { totalDocs, categories, docsByCategory };
  }
}
