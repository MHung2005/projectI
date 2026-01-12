'use client'

import { useState, type FormEvent, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { QuizRenderer } from "../quiz-render";
import { type Quiz,  type QuizQuestion } from "../quiz-types";
import { streamQuizQuestions } from "../api";
import { mlQuiz } from "../example-question/example-ml";

export default function Page() {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [quizQuestion, setQuizQuestion] = useState<Quiz>();
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionsRef = useRef<QuizQuestion[]>([]);
  const isSubmittingRef = useRef(false);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    // Ngăn chặn việc submit trùng lặp
    if  (isSubmittingRef.current || loadingPage) return;
    
    isSubmittingRef.current = true;
    setLoadingPage(true);
    setError(null);
    setQuizQuestion(undefined);
    questionsRef.current = [];
    
    // Chỉ lưu message, useEffect sẽ tự động gọi
    setMessage(inputValue);
  }, [inputValue, loadingPage]);

  // Tách riêng logic streaming
  useEffect(() => {
    if (!loadingPage || message === "") return;

    const fetchQuestions = async () => {
      try {
        for await (const q of streamQuizQuestions(message)) {
          questionsRef.current.push(q);
          console.log("Received questions:", questionsRef.current);
          // Hiển thị lần lượt các câu hỏi
          setQuizQuestion({questions: [...questionsRef.current]} as Quiz);
        }
      } catch (error) {
        setError("An error occurred while fetching quiz questions.");
      } finally {
        setLoadingPage(false);
        isSubmittingRef.current = false;
      }
    };

    fetchQuestions();
  }, [message, loadingPage]);

  return (
    <>
        <div style={{margin:'50px'}}>
             <form id="question" onSubmit={handleSubmit}>
                <Input 
                    value={inputValue}
                    onChange={(e)=>setInputValue(e.target.value)}
                    placeholder="Enter your question"/>
                <Button type="submit" form="question" disabled={loadingPage}>Send</Button>
             </form>
            <div>
                {quizQuestion && <QuizRenderer quiz={quizQuestion} />}
            </div>
        </div>
    </>
    );
}