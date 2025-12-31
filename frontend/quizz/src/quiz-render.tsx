"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Quiz, QuizResponse, QuizQuestion } from "./quiz-types";
import { QuestionType } from "./quiz-types";
import { ShortAnswer } from "./component-question/short-answer";
import { Paragraph } from "./component-question/paragraph";
import { MultipleChoice } from "./component-question/multiple-choice";
import { Checkboxes } from "./component-question/checkboxes";
import { Dropdown } from "./component-question/dropdown";
import { ProgressBar }  from "./progress-bar";
import Timer from "./timer";
import {Toaster} from "sonner";

import { useQuizState } from "./hook/useQuizState";

export interface QuizRendererProps {
  quiz: Quiz;
  onSubmit?: (response: QuizResponse) => void;
  readOnly?: boolean;
  initialAnswers?: Record<string, any>;
  className?: string;
}

export  function QuizRenderer({
  quiz,
  onSubmit,
  readOnly = false,
  className,
}: QuizRendererProps) {
  
  const {
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
  } = useQuizState(quiz, onSubmit);


  const renderUnsupported = (question: QuizQuestion) => {
    console.warn("Unsupported question type received:", (question as any)?.type, question);
    return (
      <div className="p-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800">
        Hệ thống không hỗ trợ: {(question as any)?.type}
        Vui lòng thử nhập lại câu hỏi khác.
      </div>
    );
  };

 const getCommonProps = (question: QuizQuestion, index: number) => ({
    id: question.id,
    question: question.question,
    description: question.description,
    required: question.required,
    disabled: readOnly || isSubmitted,
    error: errors[question.id],
    index: index + 1,
    total: quiz.questions.length,
    flagButton: flag[question.id],
    onFlag: () => handleFlagToggle(question.id),
  });

  const renderShortAnswer = (question: QuizQuestion, index: number) => {
    return (
      <ShortAnswer
        type={QuestionType.SHORT_ANSWER}
        {...getCommonProps(question, index)}
        config={{
          placeholder: (question.config as any)?.placeholder,
          minLength: (question.config as any)?.minLength,
          maxLength: (question.config as any)?.maxLength,
          showCharCount: (question.config as any)?.showCharCount,
        }}
        value={answers[question.id] ?? ""}
        onChange={(v: string) => handleAnswerChange(question.id, v)}
      />
    );
  };

  const renderParagraph = (question: QuizQuestion, index: number) => {
    return (
      <Paragraph
        type={QuestionType.PARAGRAPH}
        {...getCommonProps(question, index)}
        config={{
          placeholder: (question.config as any)?.placeholder,
          minLength: (question.config as any)?.minLength,
          maxLength: (question.config as any)?.maxLength,
          minWords: (question.config as any)?.minWords,
          maxWords: (question.config as any)?.maxWords,
          rows: (question.config as any)?.rows,
          showCharCount: (question.config as any)?.showCharCount,
          showWordCount: (question.config as any)?.showWordCount,
          autoResize: (question.config as any)?.autoResize
        }}
        value={answers[question.id] ?? ""}
        onChange={(v: string) => handleAnswerChange(question.id, v)}
      />
    );
  };

  const renderMultipleChoice = (question: QuizQuestion, index: number) => {
    return (
      <MultipleChoice
        type={QuestionType.MULTIPLE_CHOICE}
        {...getCommonProps(question, index)}
        config={{
          options: (question.config as any)?.options ?? [],
          layout: (question.config as any)?.layout,
          allowOther: (question.config as any)?.allowOther,
          otherValue: (question.config as any)?.otherValue,
          onOtherChange: (question.config as any)?.onOtherChange,
        }}
        value={answers[question.id] ?? ""}
        onChange={(v: string) => handleAnswerChange(question.id, v)}
      />
    );
  };

  const renderCheckboxes = (question: QuizQuestion, index: number) => {
    return (
      <Checkboxes
        type={QuestionType.CHECKBOXES}
        {...getCommonProps(question, index)}
        value={answers[question.id] ?? []}
        onChange={(v: string[]) => handleAnswerChange(question.id, v)}
        config={{
          options: (question.config as any)?.options ?? [],
          minSelections: (question.config as any)?.minSelections,
          maxSelections: (question.config as any)?.maxSelections,
          allowOther: (question.config as any)?.allowOther,
          otherValue: (question.config as any)?.otherValue,
          onOtherChange: (question.config as any)?.onOtherChange,
          showSelectAll: (question.config as any)?.showSelectAll
        }}      />
    );
  };

  const renderDropdown = (question: QuizQuestion, index: number) => {
    return (
      <Dropdown
        type={QuestionType.DROPDOWN}
        {...getCommonProps(question, index)}
        config={{
          options: (question.config as any)?.options ?? [],
          placeholder: (question.config as any)?.placeholder
        }}
        value={answers[question.id] ?? ""}
        onChange={(v: string) => handleAnswerChange(question.id, v)}
      />
    );
  };

  const renderQuestion = (question: QuizQuestion, index: number) => {
    switch (question.type) {
      case QuestionType.SHORT_ANSWER:
        return renderShortAnswer(question, index);
      case QuestionType.PARAGRAPH:
        return renderParagraph(question, index);
      case QuestionType.MULTIPLE_CHOICE:
        return renderMultipleChoice(question, index);
      case QuestionType.CHECKBOXES:
        return renderCheckboxes(question, index);
      case QuestionType.DROPDOWN:
        return renderDropdown(question, index);
      default:
        return renderUnsupported(question);
    }
  };

  function checkAnsCorrect(question: QuizQuestion, index: number): boolean {
    if (answers[question.id] === question.correctAnswer) {
      return true;
    }
    return false;
  }

  function calculateScore(): number {
      let score = 0;

      quiz.questions.forEach((question) => {
        const userAnswer = answers[question.id];

        if (question.correctAnswer !== undefined) {
          if (question.type === QuestionType.CHECKBOXES && Array.isArray(userAnswer)) {
            const correctAnswers: any[] = question.correctAnswer;
            const isCorrect =
              correctAnswers.length === userAnswer.length &&
              correctAnswers.every((ans) => userAnswer.includes(ans));

            if (isCorrect) {
              score += 1;
            }
          } else {
            if (userAnswer === question.correctAnswer) {
              score += 1;
            }
          }
        }
      });

  return score;
}

  return (
    <div className="max-w-[1400px] w-full mx-auto box-border px-3">
      <div
        id="Content"
        className="grid grid-cols-1 gap-[28px] max-w-[1400px] mx-auto p-[12px] items-start box-border
                   lg:grid-cols-[200px_1fr_320px] xl:grid-cols-[240px_1fr_100px]"
      >
        {/* Left nav */}
        <aside className="bg-white border border-[#e5e7eb] rounded-md p-2 text-center h-fit sticky top-[84px] box-border">
          <h2 className="text-lg font-semibold mb-2">Questions</h2>

          {!isSubmitted && !readOnly && (
            <Timer
              onExpire={() => handleSubmitOutOfTime()}
            />
          )}

          {/* Progress */}
          {!isSubmitted && (
            <div className="my-4">
              <ProgressBar progress={progress} answeredCount={answeredCount} quiz={quiz} />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {quiz.questions.map((question, index) => {
              const answered = Boolean(answers[question.id] && answers[question.id].length !== 0);
              const isFlagged = !!flag[question.id];
              return (
                <button
                  key={index}
                  className={cn(
                    "w-10 h-10 inline-flex items-center justify-center font-semibold rounded-lg transition-transform duration-150 hover:-translate-y-0.5 m-[2px]",
                    isFlagged
                      ? "bg-yellow-400 text-black border-none"
                      : answered
                      ? "bg-[#425cec] text-white border-none"
                      : "bg-white text-[#0f172a] border border-[#d1d5db]"
                  )}
                  onClick={() => {
                    document.getElementById(`${question.id}`)?.scrollIntoView({ behavior: "smooth" });//
                  }}
                  aria-label={`Jump to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted && !readOnly && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
                className="w-3/5 px-12 py-2 bg-[#4d4feb] text-white rounded-md hover:bg-[#7390ee] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          )}
        </aside>

        {/* Main questions */}
        <main className="max-w-[1400px] w-full mx-auto py-1 box-border">
          {isSubmitted && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Your Score: {calculateScore()} / {quiz.questions.length}</h2>
            </div>
          )}

          {quiz.questions.map((question, index) => {
            const correct = checkAnsCorrect(question, index);
            const submittedClass = isSubmitted
              ? correct
                ? "border-2 border-[#148110] bg-[#49d444] text-black"
                : "border-2 border-[#9c0a0a] bg-[#ee5757] text-black"
              : "";
            return (
              <div
                key={index}
                id={`${question.id}`}
                // id={`question-${index + 1}`}
                className={cn(
                  "items-start mb-[5px] p-3 rounded-[14px] bg-[#fbfdff] min-w-0",
                  submittedClass
                )}
              >
                {renderQuestion(question, index)}

                {isSubmitted && question.explain && (
                  <div
                    className={cn(
                      "mt-4 p-4 rounded-md",
                      answers[question.id] === question.correctAnswer
                        ? "bg-[rgba(73,212,68,0.08)] border border-[#148110] text-[#0f172a]"
                        : "bg-[rgba(233,74,95,0.06)] border border-[#9c0a0a] text-[#0f172a]"
                    )}
                  >
                    <strong className="font-medium block mb-3 text-gray-800">Explanation:</strong>
                    <span className="text-gray-700">{question.explain}</span>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>

      {/* Success Message */}
      {isSubmitted && (
        <Alert className="mt-8 border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            Quiz Submitted Successfully!
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            Your answers have been recorded. Thank you for completing the quiz.
          </AlertDescription>
        </Alert>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}