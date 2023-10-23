'use client'

import { useState, FormEvent } from 'react';
import LLM from "./lib/llm";

const QUESTION_MAX_LENGTH = 96;
const llm = new LLM();

export default function Home() {

    let [answer, setAnswer] = useState<string>('');
    let [error, setError] = useState<string | null>(null);
    let [loading, setLoading] = useState<boolean>(false);
    let [success, setSuccess] = useState<boolean>(false);

    let [questionCount, setQuestionCount] = useState<number>(0);

    // useEffect(() => {}, [])
    const llm = new LLM();

    const submitQuestion = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const question = event.currentTarget.question.value;
            event.currentTarget.question.value = null;
            const answer = await llm.generateAnswer(question)
            setAnswer(answer)

        } catch (error) {
            if (error instanceof Error) setError(error.message);
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        setQuestionCount(event.currentTarget.value.length);
    }
    return (
        <main key="main" className="flex flex-col items-center min-h-screen pt-32">
            <h1 className="text-sm py-4">{`Ask a question about me:)`}</h1>
                <form onSubmit={submitQuestion}>
                    <div className="input-group w-full max-w-xs justify-center">
                        <input className="input input-lg input-bordered text-base" 
                            type="text"
                            name="name"
                            placeholder=""
                            id="question" 
                            disabled={loading}
                            maxLength={QUESTION_MAX_LENGTH}
                            onChange={handleChange}
                            required/>
                            <button className="btn btn-lg text-base" disabled={loading}>Go</button>
                    </div>
                        <label className="label">
                            <span></span>
                            <span className="label-text-alt text-xs text-red-500">{questionCount}/{QUESTION_MAX_LENGTH} characters</span>
                        </label>
                </form>
                <div className='py-16 max-w-2xl px-8 min-h-fit'>
                {loading ? 
                (<span className="loading loading-dots loading-sm"></span>) :
                (<p className="text-base " id="answer" >{answer}</p>) 
                }
            </div>
        </main>
    )
}