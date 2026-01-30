"use client";

import { cn } from "@/lib/utils";
import { QuestionWrapper } from "./question-wrapper";
import type { ShortAnswerQuestion } from "../quiz-types";

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import {
  Field,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

export function ShortAnswer({
  id,
  question,
  description,
  required,
  error,
  disabled,
  value = '',
  onChange,
  config = {},
  className,
  index,
  total,
  flagButton,
  onFlag
}: ShortAnswerQuestion) {
  const formSchema = z.object({
    shortAnswer: z
          .string()
          .min(1, "Please provide at least 1 characters.")
          .max(20, "Please keep it under 20 characters."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortAnswer: value ?? "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
     if (typeof onChange === "function") {
          onChange(data.shortAnswer);
        }
        console.log("onSubmit called:", data.shortAnswer);
        toast("You submitted this question", {
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
  }

  return (
    <QuestionWrapper
      id={id}
      question={question}
      description={description}
      required={required}
      error={error}
      disabled={disabled}
      className={className}
      index={index}
      total={total}
      flagButton={flagButton}
      onFlag={onFlag ?? (() => {})}
    >
      <CardContent>
        <form id={`form-rhf-input-${index}`} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="shortAnswer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your answer"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form={`form-rhf-input-${index}`}>
            Save
          </Button>
        </Field>
      </CardFooter>
    </QuestionWrapper>
  );
}

