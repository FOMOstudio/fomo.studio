"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  DollarSignIcon,
  CalendarIcon,
  HelpCircleIcon,
  AwardIcon,
} from "lucide-react";
import { useState } from "react";
import { PromptSuggestion } from "../ui/prompt-suggestion";
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "../ui/prompt-input";

export function MainPromptInput() {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending:", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex flex-wrap gap-2 my-10">
        <PromptSuggestion onClick={() => setInputValue("Pricing")}>
          <DollarSignIcon className="text-primary/60 mr-2" />
          Pricing
        </PromptSuggestion>

        <PromptSuggestion onClick={() => setInputValue("Book an intro call")}>
          <CalendarIcon className="text-primary/60 mr-2" />
          Book an intro call
        </PromptSuggestion>

        <PromptSuggestion onClick={() => setInputValue("How does we work?")}>
          <HelpCircleIcon className="text-primary/60 mr-2" />
          How do we work?
        </PromptSuggestion>

        <PromptSuggestion onClick={() => setInputValue("Why using us?")}>
          <AwardIcon className="text-primary/60 mr-2" />
          Why working with us?
        </PromptSuggestion>
      </div>

      <PromptInput
        className="border-input bg-background border shadow-xs"
        value={inputValue}
        onValueChange={setInputValue}
        onSubmit={handleSend}
      >
        <PromptInputTextarea placeholder="Type a message or click a suggestion..." />
        <PromptInputActions className="justify-end">
          <Button
            size="sm"
            className="size-9 cursor-pointer rounded-full"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}
