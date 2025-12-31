import { Progress } from "@/components/ui/progress";
import type { Quiz } from "./quiz-types";

type ProgressBarProps = {
  progress: number;
  answeredCount: number;
  quiz: Quiz;
};

export function ProgressBar({ progress, answeredCount, quiz}:  ProgressBarProps) {
  return (
    <div className="mt-4 mb-2 space-y-2 w-[60%] mx-auto">
            <p className="text-sm text-muted-foreground text-center">
              {answeredCount} of {quiz.questions.length} questions
              {progress === 100 && " ✓"}
            </p>
    </div>
  );
}