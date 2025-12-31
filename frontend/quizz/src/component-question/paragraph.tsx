"use client";

import { cn } from "@/lib/utils";
import { QuestionWrapper } from "./question-wrapper";
import type { ParagraphQuestion } from "../quiz-types";

import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"

export function Paragraph({
  id,
  question,
  description,
  required,
  error,
  disabled,
  value,
  onChange,
  config={},
  className,
  index,
  total, 
  flagButton,
  onFlag
}: ParagraphQuestion) {
  const formSchema = z.object({
    about: z
      .string()
      .min(10, "Please provide at least 10 characters.")
      .max(200, "Please keep it under 200 characters."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
     if (typeof onChange === "function") {
          onChange(data.about);
        }
        console.log("onSubmit called:", data.about);
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
        <form id={`form-rhf-textarea ${index}`} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="about"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea
                    {...field}
                    id="form-rhf-textarea-about"
                    aria-invalid={fieldState.invalid}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
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
          <Button type="submit" form={`form-rhf-textarea ${index}`}>
            Save
          </Button>
        </Field>
      </CardFooter>
    </QuestionWrapper>
  );
}

