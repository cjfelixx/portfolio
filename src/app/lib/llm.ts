
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChainValues } from "langchain/dist/schema";

export default class LLM {
    private model: ChatOpenAI;
    private template: string;

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

    public async generateAnswer(question: string, isReturnSourceDocuments: boolean = false) : Promise<string> {
        try {
            const answer = await fetch('api/llm/generate-answer',
            {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({question: question, isReturnSourceDocuments: isReturnSourceDocuments}),
                signal: AbortSignal.timeout(1000*30)
            })
            return await answer.json()
        } catch(error) {
            throw new Error(`Error generating answer:${error}`)
        }
    }
}