"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { QuestionWrapper } from "./question-wrapper";
import type { CheckboxesQuestion } from "../quiz-types";

export function Checkboxes(props: CheckboxesQuestion) {
  const {
    id,
    question,
    description,
    required = false,
    className,
    value = [],
    onChange,
    disabled = false,
    // error,
    index,
    total,
    flagButton,
    onFlag,
    config = {} as {
      minSelections?: number;
      maxSelections?: number;
      options?: { id: string; label: string; value: string }[];
      allowOther?: boolean;
      otherValue?: string;
      onOtherChange?: (v?: string) => void;
      showSelectAll?: boolean;
    },
  } = props;

  const formSchema = z.object({
    responses: z.boolean(),
    tasks: z.array(z.string()).min(1, "Please select at least one choice."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      responses: true,
      tasks: Array.isArray(value) ? value : [],
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (typeof onChange === "function") {
      onChange(data.tasks);
    }
    console.log("onSubmit called:", data.tasks);
    toast("You submitted this question", {
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  };

  return (
    <>
      <QuestionWrapper
        id={id}
        question={question}
        description={description}
        required={required}
        disabled={disabled}
        className={className}
        index={index}
        total={total}
        flagButton={flagButton}
        onFlag={onFlag ?? (() => {})}
      >
          <CardContent>
            <form id={`form-rhf-checkbox-${index}`} onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                name="tasks"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldGroup className="gap-3" data-invalid={fieldState.invalid}>
                    {(config?.options ?? []).map((option, idx) => {
                      const current = Array.isArray(field.value) ? field.value : [];
                      return (
                        <Field key={`option-${idx}`} orientation="horizontal">
                          <Checkbox
                            id={`form-rhf-checkbox-${option.id}`}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={current.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const max = config?.maxSelections;
                              const now = Array.isArray(field.value) ? field.value : [];

                              if (checked) {
                                if (typeof max === "number" && now.length >= max) {
                                  toast(`You can select up to ${max} item(s).`, {
                                    position: "bottom-right",
                                  });
                                  return;
                                }
                                const newValue = Array.from(new Set([...now, option.id]));
                                field.onChange(newValue);
                                form.trigger("tasks");
                                return;
                              }

                              // uncheck
                              const newValue = now.filter((v) => v !== option.id);
                              field.onChange(newValue);
                              form.trigger("tasks");
                            }}
                            disabled={disabled}
                          />
                          <FieldLabel htmlFor={`form-rhf-checkbox-${option.id}`} className="font-normal">
                            {option.label}
                          </FieldLabel>
                        </Field>
                      );
                    })}

                    {fieldState.invalid && fieldState.error && (
                      <FieldError errors={[{ message: String(fieldState.error.message ?? fieldState.error) }]} />
                    )}
                  </FieldGroup>
                )}
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form={`form-rhf-checkbox-${index}`}>
              Save
            </Button>
          </CardFooter>
      </QuestionWrapper>
    </>
  );
}