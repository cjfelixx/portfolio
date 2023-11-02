import 'hnswlib-node';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import {Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from 'path';

import * as resumeData from '../data/resumeData.json';

import dotnenv from 'dotenv';
dotnenv.config();

const vectorStoreDirectory = path.resolve('data');
async function main(): Promise<void> {

    try{

        const docs = [
            new Document({ pageContent: JSON.stringify(resumeData['information'])}),
            new Document({ pageContent: JSON.stringify(resumeData['education'])}),
            new Document({ pageContent: JSON.stringify(resumeData['work_experiences'])}),
            new Document({ pageContent: JSON.stringify(resumeData['technical_skills'])}),
            new Document({ pageContent: JSON.stringify(resumeData['projects'])}),
        ]
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