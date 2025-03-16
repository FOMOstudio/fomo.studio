"use client";

import { Message, MessageContent } from "@/components/ai-chat/message";
import { MainPromptInput } from "./main-prompt-input";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePersistedChat } from "@/hooks/usePersistedChat";
import React from "react";
import { AIMessageToolDisplay } from "./tools";

type Props = {
  comesFrom: string | null;
};

export function AIChat({ comesFrom }: Props) {
  const {
    messages,
    handleSubmit,
    resetChatHistory,
    isMessageLoading,
    inputContent,
    setInputContent,
  } = usePersistedChat({
    fallbackInitialMessages: [
      {
        id: "1",
        content: `Hi, wandered from ${comesFrom || "the internet"} 👋`,
        role: "assistant",
        createdAt: new Date(),
      },
      {
        id: "2",
        content: `Fomo is a studio that builds unique and polished AI experiences.`,
        role: "assistant",
        createdAt: new Date(),
      },
      {
        id: "hmmm-3-I-guess",
        content: `I'm here to talk about our studio, you can ask anything!`,
        role: "assistant",
        createdAt: new Date(),
      },
    ],
  });

  const chatHasStarted = messages.length > 3;

  const handleShortcutClick = (messageContent: string) => {
    handleSubmit(messageContent);
  };

  return (
    <>
      <div className="flex flex-col w-full mx-auto min-h-[30vh] h-auto">
        <div className="mb-4 px-4">
          {messages.map((m, index) => {
            // Determine if this message is from the same entity as the previous one
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isSameEntity = prevMessage && prevMessage.role === m.role;
            const spacingClass = isSameEntity ? "mt-1.5" : "mt-3";

            return (
              <React.Fragment key={m.id}>
                {m.content && (
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
                      className={`max-w-[80%] bg-primary/5 ${
                        m.role === "user"
                          ? "rounded-2xl rounded-br-sm"
                          : "rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      <MessageContent
                        markdown={m.role === "assistant"}
                        className="px-3 py-1.5"
                      >
                        {m.content}
                      </MessageContent>
                    </Message>
                  </motion.div>
                )}
                <AIMessageToolDisplay messageParts={m.parts} messageId={m.id} />

                {
                  // Show when this is an assistant message followed by a user message
                  ((index < messages.length - 1 &&
                    messages[index + 1].role !== m.role &&
                    m.role === "assistant") ||
                    // OR when this is the last message and it's from the assistant
                    (index === messages.length - 1 &&
                      m.role === "assistant")) && (
                    <div className="flex items-center justify-center w-full ">
                      <div className="flex items-center text-xs text-muted-foreground ml-1 mt-4 mb-3 max-w-md w-full">
                        <Avatar className="size-6 mr-2">
                          <AvatarImage src="/anthony.jpg" alt="AI Anthony" />
                          <AvatarFallback>AA</AvatarFallback>
                        </Avatar>
                        <span>
                          {m.createdAt
                            ? formatDistanceToNow(new Date(m.createdAt), {
                                addSuffix: true,
                              })
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  )
                }
              </React.Fragment>
            );
          })}
          {isMessageLoading && (
            <motion.div
              className="flex md:max-w-md mx-auto justify-start"
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
              <Message className="max-w-[80%] bg-muted rounded-2xl rounded-bl-sm">
                <div className="flex items-center p-2 space-x-1">
                  <motion.div
                    className="size-1.5 bg-primary rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className="size-1.5 bg-primary rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className="size-1.5 bg-primary rounded-full"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  />
                </div>
              </Message>
            </motion.div>
          )}
        </div>
      </div>
      <MainPromptInput
        value={inputContent}
        onChange={setInputContent}
        onSubmit={handleSubmit}
        hideShortcuts={chatHasStarted}
        onShortcutClick={handleShortcutClick}
        onResetChatHistory={resetChatHistory}
        hideResetButton={!chatHasStarted}
      />
    </>
  );
}
