import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { FAQ_DATA } from "./data";

export async function loadAndSplitDocuments(): Promise<Document[]> {
  const doc = new Document({ pageContent: FAQ_DATA, metadata: { source: "FAQ" } });
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  return await splitter.splitDocuments([doc]);
}
