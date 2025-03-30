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
  disabled?: boolean;
};

export const MainPromptInput = memo(function MainPromptInput({
  hideShortcuts = false,
  hideResetButton = true,
  onShortcutClick,
  onResetChatHistory,
  onSubmit,
  disabled = false,
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
                className="size-10 cursor-pointer rounded-full mb-0.5 group"
                disabled={!inputValue.trim() || disabled}
                aria-label="Send"
                onClick={handleSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 160 221"
                  className="size-4 group-hover:-translate-y-0.5 transition-all duration-300"
                >
                  <path
                    fill="currentColor"
                    d="M74.3406 31.6906c-15.77 16.08-24.97 31.03-45.85 52.84-3.19 3.33-18.60002 13.92-18.60002 13.92s-13.93-12.27-8.73-16.24c20.92002-22.1 37.91002-50.6 58.39002-72.61998 5.52-5.93 10.87-10.250005 19.54-9.5100051 9.67.8300001 13.49 10.2399851 18.99 16.0599851 15.1004 15.97 30.1304 27.41 46.5304 41.47 2.49 2.14 12.56 10.53 13.47 12.53 1.53 3.36 1.42 12.98-.73 16.22-1.74 2.63-5.86 8.52-6.1 8.81-5.42 6.4504-10.61 9.4004-10.61 9.4004s-20.07-16.2304-24.05-19.9404c-14.83-13.82-32.9904-34.75-42.2404-52.96l-.01.02Z"
                  />
                  <path
                    fill="currentColor"
                    d="M82.1306 87.9206c.9 1.08 2.16 13.6304 2.3 16.2004 1.26 23.1 1.25 53.98 0 77.08-.72 13.2-3.73 27.23-8.54 39.44-12.74-14.41-10.75-35.6-11.46-53.52-.82-20.67-2.26-42.21-1.08-63 .18-3.15.66-10.0504 1.25-12.7504 1.5-6.88 13.77-7.98 17.53-3.45Z"
                  />
                </svg>
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
