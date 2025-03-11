"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  DollarSignIcon,
  CalendarIcon,
  HelpCircleIcon,
  AwardIcon,
} from "lucide-react";
import { FormEvent } from "react";
import { PromptSuggestion } from "../ui/prompt-suggestion";
import { Textarea } from "@/components/ui/textarea";

type MainPromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function MainPromptInput({
  value,
  onChange,
  onSubmit,
}: MainPromptInputProps) {
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex flex-wrap gap-2 my-10">
        <PromptSuggestion onClick={() => handleSuggestionClick("Pricing")}>
          <DollarSignIcon className="text-primary/60 mr-2" />
          Pricing
        </PromptSuggestion>

        <PromptSuggestion
          onClick={() => handleSuggestionClick("Book an intro call")}
        >
          <CalendarIcon className="text-primary/60 mr-2" />
          Book an intro call
        </PromptSuggestion>

        <PromptSuggestion
          onClick={() => handleSuggestionClick("How do we work?")}
        >
          <HelpCircleIcon className="text-primary/60 mr-2" />
          How do we work?
        </PromptSuggestion>

        <PromptSuggestion
          onClick={() => handleSuggestionClick("Why working with us?")}
        >
          <AwardIcon className="text-primary/60 mr-2" />
          Why working with us?
        </PromptSuggestion>
      </div>

      <form
        onSubmit={onSubmit}
        className="border-input bg-background rounded-xl rounded-br-3xl border p-2 shadow-xs"
      >
        <div className="flex items-center">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type a message or click a suggestion..."
            className="text-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form && value.trim()) {
                  form.requestSubmit();
                }
              }
            }}
          />
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="sm"
              className="size-9 cursor-pointer rounded-full"
              disabled={!value.trim()}
              aria-label="Send"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
