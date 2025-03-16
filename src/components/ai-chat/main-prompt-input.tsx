"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  DollarSignIcon,
  CalendarIcon,
  HelpCircleIcon,
  AwardIcon,
} from "lucide-react";
import { PromptSuggestion } from "./prompt-suggestion";
import TextareaAutosize from "react-textarea-autosize";
import { ProgressiveBlur } from "../progressive-blur";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { memo, useState } from "react";

type MainPromptInputProps = {
  onSubmit: (value: string) => void;
  hideShortcuts?: boolean;
  onShortcutClick?: (text: string) => void;
  hideResetButton?: boolean;
  onResetChatHistory: () => void;
};

export const MainPromptInput = memo(function MainPromptInput({
  hideShortcuts = false,
  hideResetButton = true,
  onShortcutClick,
  onResetChatHistory,
  onSubmit,
}: MainPromptInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSuggestionClick = (suggestion: string) => {
    if (onShortcutClick) {
      onShortcutClick(suggestion);
    } else {
      setInputValue(suggestion);
    }
  };

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSubmit(trimmedValue);
      setInputValue("");
    }
  };

  useHotkeys(
    "mod+enter",
    () => {
      handleSubmit();
    },
    {
      enableOnFormTags: ["textarea"],
    }
  );

  return (
    <>
      <div className="w-full sticky bottom-0 right-0 left-0 z-[1000] px-4 md:px-0">
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
            <div className="flex flex-col gap-2 my-6 max-w-md z-[1400] items-start w-full">
              <PromptSuggestion
                onClick={() => handleSuggestionClick("Pricing")}
                className="group"
              >
                <DollarSignIcon className="text-primary/60 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Pricing
              </PromptSuggestion>

              <PromptSuggestion
                onClick={() => handleSuggestionClick("Book an intro call")}
                className="group"
              >
                <CalendarIcon className="text-primary/60 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Book an intro call
              </PromptSuggestion>

              <PromptSuggestion
                onClick={() => handleSuggestionClick("How do we work?")}
                className="group"
              >
                <HelpCircleIcon className="text-primary/60 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                How do we work?
              </PromptSuggestion>

              <PromptSuggestion
                onClick={() => handleSuggestionClick("Why working with us?")}
                className="group"
              >
                <AwardIcon className="text-primary/60 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Why working with us?
              </PromptSuggestion>
            </div>
          )}

          <div className="md:max-w-md z-[1400] w-full flex gap-2">
            <div className="flex-1 border-input bg-background rounded-3xl border pl-3 shadow-xs pb-1">
              <TextareaAutosize
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message or click a suggestion..."
                cols={1}
                className="text-primary flex-1 h-fit resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
            <div className="pr-1 self-end">
              <Button
                type="submit"
                size="sm"
                className="size-10 cursor-pointer rounded-full mb-0.5"
                disabled={!inputValue.trim()}
                aria-label="Send"
                onClick={handleSubmit}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 mt-4 w-full flex flex-col justify-end">
        {!hideResetButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetChatHistory}
            className="z-[1600] w-fit mx-auto"
          >
            Reset chat
          </Button>
        )}
      </div>
      <div className="h-10 w-full" id="chat-input-anchor" />
    </>
  );
});
