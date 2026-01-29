import z from "zod";

// Question types
export enum QuestionType {
  SHORT_ANSWER = "short_answer",
  PARAGRAPH = "paragraph",
  MULTIPLE_CHOICE = "multiple_choice",
  CHECKBOXES = "checkboxes",
  DROPDOWN = "dropdown",
  EMAIL = "email",
  NUMBER = "number",
  SECTION_HEADER = "section_header",
}

// Option cho các câu hỏi lựa chọn
export interface Option {
  id: string;
  label: string;
  value: string;
}


// Cấu trúc câu hỏi
interface QuestionBase {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  required?: boolean;
  explain?: string;
  className?: string;

  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  error?: string;
  index?: number;
  total?: number;
  flagButton?: React.ReactNode;
  onFlag?: () => void;

  config?: Record<string, any>;
}

export interface ShortAnswerQuestion extends QuestionBase {
  type: QuestionType.SHORT_ANSWER;
  correctAnswer?: string;
  value?: string;
  onChange?: (value: string) => void;
  config?: {
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    showCharCount?: boolean;
    pattern?: string;
  };
}

export interface ParagraphQuestion extends QuestionBase {
  type: QuestionType.PARAGRAPH;
  correctAnswer?: string;
  value?: string;
  onChange?: (value: string) => void;
  config?: {
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    minWords?: number;
    maxWords?: number;
    rows?: number;
    showCharCount?: boolean;
    showWordCount?: boolean;
    autoResize?: boolean;
  };
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: QuestionType.MULTIPLE_CHOICE;
  correctAnswer?: string;
  value?: string;
  onChange?: (value: string) => void;
  config?: {
    options: Option[];
    layout?: "vertical" | "horizontal";
    allowOther?: boolean;
    otherValue?: string;
    onOtherChange?: (value: string) => void;
  };
}

export interface CheckboxesQuestion extends QuestionBase {
  type: QuestionType.CHECKBOXES;
  correctAnswer?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  config?: {
    options: Option[];
    minSelections?: number;
    maxSelections?: number;
    allowOther?: boolean;
    otherValue?: string;
    onOtherChange?: (value: string) => void;
    showSelectAll?: boolean;
  };
}

export interface DropdownQuestion extends QuestionBase {
  type: QuestionType.DROPDOWN;
  correctAnswer?: string;
  value?: string;
  onChange?: (value: string) => void;
  config?: {
    options: Option[];
    placeholder?: string;
  };
}

export type QuizQuestion =
  | ShortAnswerQuestion
  | ParagraphQuestion
  | MultipleChoiceQuestion
  | CheckboxesQuestion
  | DropdownQuestion;

// Quiz structure
export interface Quiz {
  questions: QuizQuestion[];
}

// Quiz response
export interface QuizResponse {
  userId?: string;
  answers: Record<string, any>; // questionId -> answer
  submittedAt: Date;
}

// Validation types
export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "min" | "max" | "email";
  value?: any;
  message: string;
}

export type ValidatorFunction = (value: any) => string | null;

// Zod schemas cho validation và parsing
export const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(QuestionType),
  question: z.string(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  explain: z.string().optional(), ////
  config: z.record(z.string(), z.any()).optional(),
});

export const QuizSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(QuizQuestionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const QuizResponseSchema = z.object({
  quizId: z.string(),
  userId: z.string().optional(),
  answers: z.record(z.string(), z.any()),
  submittedAt: z.date(),
});
