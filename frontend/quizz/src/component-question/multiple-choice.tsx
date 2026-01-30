"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionWrapper } from "./question-wrapper";
import type { MultipleChoiceQuestion } from "../quiz-types";
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldSet,
} from "@/components/ui/field";

export function MultipleChoice({
  id,
  question,
  description,
  required,
  className,
  value,
  onChange,
  disabled,
  error,
  index,
  total,
  flagButton,
  onFlag,
  config = {
    options: [],
  },
}: MultipleChoiceQuestion) {
  
  const formSchema = z.object({
    plan: z.string().min(1, "You must select a subscription plan to continue."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: value??""
    },
  })

 function onSubmit(data: z.infer<typeof formSchema>) {
    // cập nhật biến toàn cục qua props.onChange (nếu được cung cấp)
    if (typeof onChange === "function") {
      onChange(data.plan);
    }
    console.log("onSubmit called:", data);
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
            error={error ?? ""}
            disabled={disabled}
            className={className}
            index={index}
            total={total}
            flagButton={flagButton}
            onFlag={onFlag ?? (() => {})}
          >
        <CardContent>
          <form id={`form-rhf-radiogroup-${index}`} onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                  name="plan"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet data-invalid={fieldState.invalid}>
                        <RadioGroup
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          disabled={disabled}
                        >
                          {config.options?.map((opt, i) => (
                            <div key={opt.value ?? i} className="flex items-center space-x-2">
                              <RadioGroupItem value={opt.value} id={`${field.name}-${i}`} />
                              <Label htmlFor={`${field.name}-${i}`}>{opt.label ?? opt.value}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                         {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                    </FieldSet>
                  )}
                />
          </form>
      </CardContent>
      <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form={`form-rhf-radiogroup-${index}`}>
              Save
            </Button>
          </Field>
      </CardFooter>
  </QuestionWrapper>

);
}