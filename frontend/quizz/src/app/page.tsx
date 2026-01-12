'use client'

import { useState, type FormEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { QuizRenderer } from "../quiz-render";
import { type Quiz,  type QuizQuestion } from "../quiz-types";
import { streamQuizQuestions } from "../api";
import { mlQuiz } from "../example-question/example-ml";

export default function Page() {
  const [quizQuestion, setQuizQuestion] = useState<Quiz>();
  const [message, setMessage] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [submit, setSubmit] = useState(false);
  const questionRef = useRef<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null> (null);
  const [quizKey, setQuizKey] = useState(0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset lại trước khi nhận
    questionRef.current = [];
    setQuizQuestion(undefined);
    setError(null);
    setQuizKey(prev => prev + 1);
    setLoadingPage(true);
    setSubmit(true);
  }

  useEffect(() => {
    if (submit == false) return;

    const fetchQuestion = async() => {
      try {
        for await (const q of streamQuizQuestions(message)) {
          questionRef.current.push(q);
          setQuizQuestion({questions : [...questionRef.current]} as Quiz);
        }
      } catch (error) {
        setError("Có lỗi xảy ra khi truy vấn câu hỏi");
      } finally {
        setLoadingPage(false);
        setSubmit(false);
      }
    }

    fetchQuestion();
  },[submit])

  return (
    <>
        <div style={{margin:'50px'}}>
             <form id="question" onSubmit={handleSubmit}>
                <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your question"/>
                <Button type="submit" form="question" disabled={loadingPage}>Send</Button>
             </form>
            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            <div>
                {quizQuestion && <QuizRenderer key={quizKey} quiz={quizQuestion} />}
            </div>
        </div>
    </>
    );
}