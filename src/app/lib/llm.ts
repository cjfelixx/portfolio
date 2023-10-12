
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChainValues } from "langchain/dist/schema";

export default class LLM {
    private model: ChatOpenAI;
    private template: string;
    private vectorStore: MemoryVectorStore | undefined = undefined;

    constructor() {
        try {
            this.template = ` Use the following pieces of resume information to answer the question at the end.
            If you don't know the answer, just say "I don't know", don't try to make up an answer. Answer in first-person point of view.
            {context}

            Question: {question}
            Answer:`

            this.model =  new ChatOpenAI({modelName: "gpt-3.5-turbo",openAIApiKey:process.env.OPENAI_API_KEY});
        } catch (error) {
            throw new Error(`Error initializing LLM:${error}`)
        }
    }

    public async initialize() {
        try {
            this.vectorStore = await this.VectorStore()
        } catch (error) {
            throw new Error(`Error initializing LLM:${error}`)
        }
    }

    async VectorStore(): Promise<MemoryVectorStore> {
        try {
            const response = await fetch('api/llm/load-data');
            const docs = await response.json();
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 0,
            });
            const splitDocs = await textSplitter.splitDocuments(docs);
            const embeddings = new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_API_KEY});
            return MemoryVectorStore.fromDocuments(splitDocs,embeddings);
        } catch (error) {
            throw new Error(`Error initializing LLM:${error}`)
        }

    }
    public async generateAnswer(question: string, isReturnSourceDocuments?: boolean) : Promise<ChainValues> {
        try {
            if (this.vectorStore) {
                const vectorStoreRetriever =  this.vectorStore.asRetriever();
                const chain = RetrievalQAChain.fromLLM(this.model,
                    vectorStoreRetriever,
                    {
                        prompt: PromptTemplate.fromTemplate(this.template),
                        returnSourceDocuments: isReturnSourceDocuments,
                        verbose: true
                    },)
                return await chain.call({query:question},{callbacks:[
                    {handleLLMNewToken(token: string) {console.log({token})}}
                ]})
            }
            else {
                throw new Error("Vectorstore not initialized");
            }
        } catch(error) {
            throw new Error(`Error generating answer:${error}`)
        }
    }

    public async getRelevantInformation(question: string, isReturnSourceDocuments?: boolean) : Promise<any> {
        try {
            if (this.vectorStore) {
                
                const result = await this.vectorStore.similaritySearch(question,10);
                console.log(result)
                return result
            }
            else {
                throw new Error("Vectorstore not initialized");
            }
        } catch(error) {
            throw new Error(`Error generating answer:${error}`)
        }
    }
}