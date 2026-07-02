import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { loadAndSplitDocuments } from "./documentLoader";
import { Document } from "@langchain/core/documents";

let vectorStoreInstance: MemoryVectorStore | null = null;

export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (vectorStoreInstance) return vectorStoreInstance;

  const docs = await loadAndSplitDocuments();
  
  // Menggunakan custom endpoint untuk proses RAG (Embeddings)
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002", // Anda bisa mengubah ini ke nama model embedding yang didukung custom API Anda
    configuration: {
      baseURL: 'https://api-ai.hbyspirates.my.id/v1',
      apiKey: process.env.MIMO_API_KEY,
    }
  });

  vectorStoreInstance = await MemoryVectorStore.fromDocuments(docs, embeddings);
  
  return vectorStoreInstance;
}

export async function searchContext(query: string, k: number = 2): Promise<string> {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, k);
  return results.map((r: Document) => r.pageContent).join("\n\n");
}
