'use client'

import Image from "next/image";
import { useState, FormEvent, useEffect } from 'react';
import LLM from "./lib/llm";

const QUESTION_MAX_LENGTH = 96;
const llm = new LLM();

export default function Home() {

    let [question, setQuestion] = useState<string>('');
    let [answer, setAnswer] = useState<string>('');
    let [error, setError] = useState<string | null>(null);
    let [loading, setLoading] = useState<boolean>(false);
    let [success, setSuccess] = useState<boolean>(false);

    let [questionCount, setQuestionCount] = useState<number>(0);


    useEffect(() => {
        llm.initialize()
    }, [])


    const submitQuestion = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const question = event.currentTarget.question.value;
            setQuestion(question);
            const answer = await llm.generateAnswer(event.currentTarget.question.value, true);
            console.log(answer);
            setAnswer(answer.text)

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
            <main className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-sm py-4">{`Ask a question about me:)`}</h1>
                <form onSubmit={submitQuestion}>
                    {/* <label htmlFor="question">Ask a question about me</label> */}
                    <input className="input input-lg input-bordered w-full max-w-xs text-base" 
                        type="text"
                        name="name"
                        placeholder=""
                        id="question" 
                        disabled={loading}
                        maxLength={QUESTION_MAX_LENGTH}
                        onChange={handleChange}
                        required/>
                        <label className="label">
                            <span></span>
                            <span className="label-text-alt text-xs text-red-500">{questionCount}/{QUESTION_MAX_LENGTH} characters</span>
                        </label>
                </form>
                <p className="text-base py-24 max-w-2xl" id="answer" >{answer}</p>
            </main>
    )
}