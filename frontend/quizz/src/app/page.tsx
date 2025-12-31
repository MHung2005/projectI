'use client'

import { useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { QuizRenderer } from "../quiz-render";
import { type Quiz,  type QuizQuestion } from "../quiz-types";
import { streamQuizQuestions } from "../api";
import { mlQuiz } from "../example-question/example-ml";

export default function Page() {
  const [message, setMessage] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<Quiz>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuizQuestion(undefined);
    controllerRef.current = new AbortController();

    try {   
        const questions: QuizQuestion[] = [];
            // for await (const q of streamQuizQuestions(message)) {
            //     questions.push(q);
            //     console.log("Received questions:", questions);
            //     setQuizQuestion({questions} as Quiz);
            // }
        setQuizQuestion(mlQuiz);
    } catch (error) {
        setError("An error occurred while fetching quiz questions.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
        <div style={{margin:'50px'}}>
             <form id="question" onSubmit={handleSubmit}>
                <Input 
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Enter your question"/>
                <Button type="submit" form="question">Send</Button>
             </form>
            <div>
                {quizQuestion && <QuizRenderer quiz={quizQuestion} />}
            </div>
        </div>
    </>
    );
}