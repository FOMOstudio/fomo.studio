"use client";

import {
  Message as AIMessage,
  MessageContent,
} from "@/components/ai-chat/message";
import { MainPromptInput } from "./main-prompt-input";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePersistedChat } from "@/hooks/usePersistedChat";
import React, { useCallback, useEffect, useRef } from "react";
import { AIMessageToolDisplay } from "./tools";
import { Message } from "@ai-sdk/react";

type Props = {
  comesFrom: string | null;
};

type MessageItemProps = {
  message: Message;
  index: number;
  messages: Message[];
  isMessageLoading: boolean;
};

const MessageItem = React.memo(
  ({ message, index, messages, isMessageLoading }: MessageItemProps) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isSameEntity = prevMessage && prevMessage.role === message.role;
    const spacingClass = isSameEntity ? "mt-1.5" : "mt-3";

    const isLastMessage = index === messages.length - 1;
    const hideAvatar =
      isLastMessage && message.role === "assistant" && isMessageLoading;

    return (
      <React.Fragment>
        <AIMessageToolDisplay
          messageParts={message.parts}
          messageId={message.id}
        />
        {message.content && (
          <motion.div
            className={`flex md:max-w-md mx-auto ${
              message.role === "user" ? "justify-end" : "justify-start"
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
            <AIMessage
              className={`max-w-[80%] bg-primary/5 ${
                message.role === "user"
                  ? "rounded-2xl rounded-br-sm"
                  : "rounded-2xl rounded-bl-sm"
              }`}
            >
              <MessageContent
                markdown={message.role === "assistant"}
                className="px-3 py-1.5"
              >
                {message.content}
              </MessageContent>
            </AIMessage>
          </motion.div>
        )}
        {((index < messages.length - 1 &&
          messages[index + 1].role !== message.role &&
          message.role === "assistant") ||
          (index === messages.length - 1 && message.role === "assistant")) &&
          !hideAvatar && (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center text-xs text-muted-foreground ml-1 mt-4 mb-3 max-w-md w-full">
                <Avatar className="size-6 mr-2">
                  <AvatarImage src="/anthony.jpg" alt="AI Anthony" />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
                <span>
                  {message.createdAt
                    ? formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </span>
              </div>
            </div>
          )}
      </React.Fragment>
    );
  }
);

MessageItem.displayName = "MessageItem";

const getInitialMessages = (comesFrom: string | null) => [
  {
    id: "1",
    content: `Hi, wandered from ${comesFrom || "the internet"} 👋`,
    role: "assistant" as const,
    createdAt: new Date(),
  },
  {
    id: "2",
    content: `Fomo is a studio that builds unique and polished AI experiences.`,
    role: "assistant" as const,
    createdAt: new Date(),
  },
  {
    id: "hmmm-3-I-guess",
    content: `I'm here to talk about our studio, you can ask anything!`,
    role: "assistant" as const,
    createdAt: new Date(),
  },
];

export function AIChat({ comesFrom }: Props) {
  const { messages, handleSubmit, resetChatHistory, isMessageLoading } =
    usePersistedChat({
      fallbackInitialMessages: getInitialMessages(comesFrom),
    });

  const chatHasStarted = messages.length > 3;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitiallyScrolled = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const viewportHeight = window.innerHeight;
      const scrollPadding = viewportHeight * 0.2; // 20% of viewport height

      window.scrollTo({
        top:
          document.documentElement.scrollHeight -
          viewportHeight +
          scrollPadding,
        behavior: hasInitiallyScrolled.current ? "smooth" : "auto",
      });
    }
  }, []);

  // Initial scroll when messages are loaded
  useEffect(() => {
    if (messages.length > 0 && !hasInitiallyScrolled.current) {
      // Small delay to ensure all content is rendered
      const timer = setTimeout(() => {
        scrollToBottom();
        hasInitiallyScrolled.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom]);

  // Scroll on new messages or loading state changes
  useEffect(() => {
    if (hasInitiallyScrolled.current) {
      scrollToBottom();
    }
  }, [messages, isMessageLoading, scrollToBottom]);

  const handleShortcutClick = useCallback(
    (messageContent: string) => {
      handleSubmit(messageContent);
    },
    [handleSubmit]
  );

  return (
    <>
      <div className="flex flex-col w-full mx-auto min-h-[30vh] h-auto">
        <div className="mb-4 px-4">
          {messages.map((m, index) => (
            <MessageItem
              key={m.id}
              message={m}
              index={index}
              messages={messages}
              isMessageLoading={isMessageLoading}
            />
          ))}
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
              <AIMessage className="max-w-[80%] bg-muted rounded-2xl rounded-bl-sm">
                <div className="flex items-center p-3 space-x-1">
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
              </AIMessage>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-[20px]" />
        </div>
      </div>

      <MainPromptInput
        onSubmit={handleSubmit}
        hideShortcuts={chatHasStarted}
        onShortcutClick={handleShortcutClick}
        onResetChatHistory={resetChatHistory}
        hideResetButton={!chatHasStarted}
      />
    </>
  );
}
