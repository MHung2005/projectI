"use client";
import { useState, useMemo } from "react";
import type { Quiz } from "../quiz-types";
import { toast } from "sonner";
import { validateAnswers } from "../core/validateAnswer";
import { scrollToFirstError } from "../core/scrollToError";    

export function useQuizState(quiz: Quiz) {
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    quiz.questions.forEach((q) => (init[q.id] = ""));
    return init;
  });

  const [flag, setFlag] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const progress = useMemo(() => {
    const required = quiz.questions.filter((q) => q.required);
    if (required.length === 0) return 100;
    const answered = required.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== "" && answers[q.id] !== null
    );
    return Math.round((answered.length / required.length) * 100);
  }, [answers, quiz.questions]);

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(
      (k) => answers[k] !== undefined && answers[k] !== "" && answers[k] !== null
    ).length;
  }, [answers]);

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Clear error for this question
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const handleFlagToggle = (questionId: string) => {
    setFlag((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  }

  // Handle submit
  const handleSubmit = async () => {
    const result = validateAnswers(quiz, answers, setErrors);
    if (!result.valid) {
      toast.error("Please complete all required fields");
      requestAnimationFrame(() => scrollToFirstError(result.errors));
      return;
    }

    await submitQuiz();
  };

  // Handle submit out of time (skip validation)
  const handleSubmitOutOfTime = async () => {
    await submitQuiz();
  };

  // Common submit logic
  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      setIsSubmitted(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    handleAnswerChange,
    flag,       
    handleFlagToggle,
    errors,
    isSubmitting,
    isSubmitted,
    progress,
    answeredCount,
    handleSubmit,
    handleSubmitOutOfTime
  };
}