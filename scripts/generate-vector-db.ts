import 'hnswlib-node';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import path from 'path';

import dotnenv from 'dotenv';
dotnenv.config();

const vectorStoreDirectory = path.resolve('data');
async function main(): Promise<void> {

    try{
        const loader = new PDFLoader(path.resolve("public/ClydeFelix_resume.pdf"));
        const docs = await loader.load();
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 0,
        });
        const splitDocs = await textSplitter.splitDocuments(docs);
        const embeddings = new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_API_KEY});
        const vectorStore = await HNSWLib.fromDocuments(splitDocs,embeddings)

        await vectorStore.save(vectorStoreDirectory);

    } catch (error) {
        throw new Error(`Error initializing LLM:${error}`);
    }
}   

(async () => {
    await main();
    console.log('Vector DB generation complete');
  })();