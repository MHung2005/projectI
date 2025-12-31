import { QuestionType } from "../quiz-types";
import type { Quiz } from "../quiz-types";

export function validateAnswers(
  quiz: Quiz,
  answers: Record<string, any>,
  setErrors: (err: Record<string, string>) => void
): { valid: boolean; errors: Record<string, string> } {
  const newErrors: Record<string, string> = {};

  quiz.questions.forEach((q) => {
    const ans = answers[q.id];

    if (q.required) {
      if (ans === undefined || ans === "" || ans === null) {
        newErrors[q.id] = "This question is required";
      } else if (Array.isArray(ans) && ans.length === 0) {
        newErrors[q.id] = "Please select at least one option";
      }
    }

    const cfg = q.config || {};
    if (ans) {
      if (q.type === QuestionType.CHECKBOXES && Array.isArray(ans)) {
        const minSel = (cfg as { minSelections?: number }).minSelections;
        const maxSel = (cfg as { maxSelections?: number }).maxSelections;
        if (typeof minSel === "number" && ans.length < minSel) {
          newErrors[q.id] = `Please select at least ${minSel} option(s)`;
        }
        if (typeof maxSel === "number" && ans.length > maxSel) {
          newErrors[q.id] = `Please select no more than ${maxSel} option(s)`;
        }
      }

      if (
        (q.type === QuestionType.SHORT_ANSWER || q.type === QuestionType.PARAGRAPH) &&
        typeof ans === "string"
      ) {
        const textCfg = cfg as { minLength?: number; maxLength?: number };
        if (typeof textCfg.minLength === "number" && ans.length < textCfg.minLength) {
          newErrors[q.id] = `Please enter at least ${textCfg.minLength} characters`;
        }
        if (typeof textCfg.maxLength === "number" && ans.length > textCfg.maxLength) {
          newErrors[q.id] = `Please enter no more than ${textCfg.maxLength} characters`;
        }
      }
    }
  });

  setErrors(newErrors);
  return { valid: Object.keys(newErrors).length === 0, errors: newErrors };
}