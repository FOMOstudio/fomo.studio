"use client";

import { FormEvent, ChangeEvent } from "react";
import { Message, MessageContent } from "@/components/ai-chat/message";
import { MainPromptInput } from "./main-prompt-input";
import { motion } from "motion/react";

import { usePersistedChat } from "@/hooks/usePersistedChat";
import { Button } from "../ui/button";
import React from "react";

type Props = {
  comesFrom: string | null;
};

export function AIChat({ comesFrom }: Props) {
  const { messages, handleInputChange, handleSubmit, input, resetChatHistory } =
    usePersistedChat({
      fallbackInitialMessages: [
        {
          id: "1",
          content: `Hi, wandered from ${
            comesFrom || "the internet"
          }, I'm here to talk about our studio 👋`,
          role: "assistant",
        },
      ],
    });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleChange = (value: string) => {
    // Create a synthetic event to pass to handleInputChange
    const syntheticEvent = {
      target: { value },
    } as ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);
  };

  const chatHasStarted = messages.length > 1;

  const handleShortcutClick = (text: string) => {
    handleChange(text);
    handleSubmit();
  };

  return (
    <>
      <div className="flex flex-col w-full mx-auto">
        <div className="mb-4 px-4">
          {messages.map((m, index) => {
            // Determine if this message is from the same entity as the previous one
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isSameEntity = prevMessage && prevMessage.role === m.role;
            const spacingClass = isSameEntity ? "mt-1" : "mt-3";

            return (
              <React.Fragment key={m.id}>
                <motion.div
                  className={`flex md:max-w-md mx-auto ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  } ${index > 0 ? spacingClass : ""}`}
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <Message
                    className={`max-w-[80%] ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                        : "bg-muted rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    <MessageContent
                      markdown={m.role === "assistant"}
                      className="p-2"
                    >
                      {m.content}
                    </MessageContent>
                  </Message>
                </motion.div>

                <motion.div
                  className={`mt-4 flex items-center justify-center w-full`}
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <div className="w-fit h-72 flex gap-3 mx-auto">
                    <div className="w-68 min-w-68 h-72 bg-amber-100 rounded-xl"></div>
                    <div className="w-68 min-w-68 h-72 bg-amber-100 rounded-xl"></div>
                    <div className="w-68 min-w-68 h-72 bg-amber-100 rounded-xl"></div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <MainPromptInput
        value={input}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
        hideShortcuts={chatHasStarted}
        onShortcutClick={handleShortcutClick}
      />
      <footer className="mx-auto mt-10 md:max-w-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetChatHistory}
          className="inline"
        >
          Reset chat
        </Button>
      </footer>
    </>
  );
}
