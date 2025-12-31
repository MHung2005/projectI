"use client";

import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import {Toaster} from "sonner"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface QuestionWrapperProps {
  id: string;
  question: string;
  description?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  index?: number;
  total?: number;
  flagButton?: React.ReactNode;
}

export function QuestionWrapper({
  id,
  question,
  description,
  required,
  error,
  disabled,
  children,
  className,
  index,
  total,
  flagButton,
  onFlag,
}: QuestionWrapperProps & { onFlag: () => void }) {
  return (
    <div
      className={cn(
        "space-y-3 p-4 rounded-lg border bg-card mb-5",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <button
                className="flex items-center gap-2 p-0 rounded-md hover:bg-gray-100 transition"
                onClick={() => onFlag()}
                style = {{margin:"0"}}
              >
                <Flag className={`w-5 h-5 ${flagButton ? "text-yellow-500" : "text-gray-400"}`} />
        </button>

        <div className="min-w-0">
          <label
            htmlFor={id}
            className="text-base font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
          >
            {index ? `Question ${index}${total ? `/${total}` : ""}: ` : ""}
          </label>
        </div>
      </div>

      {/* Children (Input Component) */}
      <div
        aria-describedby={description ? `${id}-description` : undefined}
        aria-invalid={error ? "true" : "false"}
        aria-errormessage={error ? `${id}-error` : undefined}
      >
        <Card className="w-full sm:max-w-none border-0 shadow-none">
          <CardHeader>
            <CardTitle>{question}</CardTitle>
              <CardDescription>{description}</CardDescription>
          </CardHeader>
          {children}
        </Card>
      </div>
    </div>
  );
}

