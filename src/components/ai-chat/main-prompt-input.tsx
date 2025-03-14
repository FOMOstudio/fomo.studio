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
import { PromptSuggestion } from "./prompt-suggestion";
import TextareaAutosize from "react-textarea-autosize";
import { ProgressiveBlur } from "../../../components/motion-primitives/progressive-blur";
import { cn } from "@/lib/utils";

type MainPromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  hideShortcuts?: boolean;
  onShortcutClick?: (text: string) => void;
};

export function MainPromptInput({
  value,
  onChange,
  onSubmit,
  hideShortcuts = false,
  onShortcutClick,
}: MainPromptInputProps) {
  const handleSuggestionClick = (suggestion: string) => {
    if (onShortcutClick) {
      onShortcutClick(suggestion);
    } else {
      onChange(suggestion);
    }
  };

  return (
    <div className="w-full sticky border-0 right-0 left-0 bg-amber-400">
      <div className="w-full relative flex flex-col space-y-4 items-center h-fit py-4">
        <ProgressiveBlur
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-[1000] h-[80px] w-full transition-all duration-100"
          )}
          blurIntensity={4}
          blurLayers={4}
          direction="bottom"
        />
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-[1200] h-[120px] bg-gradient-to-b from-transparent to-os-background/70 transition-opacity"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-[1300] h-[120px] bg-gradient-to-b from-transparent to-os-background transition-opacity"
          )}
        />
        {!hideShortcuts && (
          <div className="flex flex-wrap gap-2 my-6 max-w-md z-[1400]">
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
        )}

        <form
          onSubmit={onSubmit}
          className="border-input bg-background rounded-3xl border pl-2 shadow-xs md:max-w-md z-[1400] w-full"
        >
          <div className="flex items-center">
            <TextareaAutosize
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type a message or click a suggestion..."
              cols={1}
              className="text-primary flex-1 h-fit resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <div className="flex flex-col items-end justify-end h-full py-1 pr-1">
              <Button
                type="submit"
                size="sm"
                className="size-7 cursor-pointer rounded-full"
                disabled={!value.trim()}
                aria-label="Send"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
