import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from 'langchain/chains';

import path from 'path';
const vectorStoreDirectory = path.resolve('data');

const template = `Use the following pieces of career information to answer the question at the end.
If you do not know the answer, say "I don't know", don't try to make up an answer. Answer in first person point of view.
{context}

Question: {question}
Answer:

Take a deep breath and work on this problem step by step.
`

export async function POST(request: Request) {

    try {
        
        const { question, isReturnSourceDocuments } = await request.json();
        
        const vectorStore = await HNSWLib.load(vectorStoreDirectory,new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_API_KEY}))
        const model =  new ChatOpenAI({modelName: "gpt-3.5-turbo",openAIApiKey:process.env.OPENAI_API_KEY});
        const chain = RetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever(),
            {
                prompt: PromptTemplate.fromTemplate(template),
                returnSourceDocuments: isReturnSourceDocuments,
                verbose: true
            }
            )
            const answer = await chain.call({query:question, timeout: 1000*60},{callbacks:[
                {handleLLMNewToken(token: string) {console.log({token})}}
            ]})
            
            return Response.json(answer.text, {
                status: 200,
            })
            
    } catch (error) {
        return Response.json("So sorry, I cannot answer right now, can you ask again in a few minutes? :)",{
            status:500
        })
    }
}