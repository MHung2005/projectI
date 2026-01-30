"use client";

import { QuestionWrapper } from "./question-wrapper";
import type { DropdownQuestion } from "../quiz-types";

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
  FieldGroup,
} from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Dropdown({
  id,
  question,
  description,
  required,
  error,
  disabled,
  value,
  onChange,
  config = {
    options: [],
    placeholder: "Select an option"
  },
  className,
  index,
  total,
  flagButton,
  onFlag
}: DropdownQuestion) {
  const formSchema = z.object({
    dropdown: z
      .string()
      .min(1, "Please select your spoken language.")
      .refine((val) => val !== "auto", {
        message:
          "Auto-detection is not allowed. Please select a specific language.",
      }),
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dropdown: value ?? "",
    },
  })
  
  function onSubmit(data: z.infer<typeof formSchema>) {
       if (typeof onChange === "function") {
            onChange(data.dropdown);
          }
          console.log("onSubmit called:", data.dropdown);
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
        <form id={`form-rhf-select-${index}`} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="dropdown"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      id="form-rhf-select-option"
                      aria-invalid={fieldState.invalid}
                      aria-label={question}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder={config.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
        <CardFooter>
         <Field orientation="horizontal">
           <Button type="submit" form={`form-rhf-select-${index}`}>
             Save
           </Button>
         </Field>
       </CardFooter>     
    </QuestionWrapper>
  );
}

