import 'hnswlib-node';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import {Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from 'path';

import resumeData from '../data/resumeData.json';

import dotnenv from 'dotenv';
dotnenv.config();

const vectorStoreDirectory = path.resolve('data');
async function main(): Promise<void> {

    try{
        const docs = Object.entries(resumeData).map((k) => 
            new Document({pageContent: JSON.stringify("My " + k[0] + " is/are " + JSON.stringify(k[1]))}))
        const embeddings = new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_API_KEY});
        const vectorStore = await HNSWLib.fromDocuments(docs,embeddings)

        await vectorStore.save(vectorStoreDirectory);

    } catch (error) {
        throw new Error(`Error initializing LLM:${error}`);
    }
}   

(async () => {
    await main();
    console.log('Vector DB generation complete');
  })();