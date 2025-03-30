"use client";

import {
  Message as AIMessage,
  MessageContent,
} from "@/components/ai-chat/message";
import { MainPromptInput } from "./main-prompt-input";
import { motion } from "motion/react";
import { formatDistanceToNow, subSeconds } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePersistedChat } from "@/hooks/usePersistedChat";
import React, { useCallback, useEffect, useRef } from "react";
import { AIMessageToolDisplay } from "./tools";
import { Message } from "@ai-sdk/react";
import { TooltipOnHover } from "../ui/tooltip";
import Image from "next/image";
import anthonyImage from "../../../public/anthony.png";

type Props = {
  comesFrom: string | null;
};

type MessageItemProps = {
  message: Message;
  index: number;
  messages: Message[];
  isMessageLoading: boolean;
  onAppendUserMessageToChat: (message: string) => void;
};

const MessageItem = React.memo(
  ({
    message,
    index,
    messages,
    isMessageLoading,
    onAppendUserMessageToChat,
  }: MessageItemProps) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isSameEntity = prevMessage && prevMessage.role === message.role;
    const spacingClass = isSameEntity ? "mt-1.5" : "mt-3";

    const isLastMessage = index === messages.length - 1;
    const hideAvatar =
      isLastMessage && message.role === "assistant" && isMessageLoading;

    return (
      <React.Fragment>
        <AIMessageToolDisplay
          onAppendUserMessageToChat={onAppendUserMessageToChat}
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
                <TooltipOnHover content="AI-ed Anthony">
                  <div className="relative mr-2 group">
                    <Avatar className="size-8">
                      <Image
                        src={anthonyImage.src}
                        placeholder="blur"
                        blurDataURL={anthonyImage.blurDataURL}
                        width={anthonyImage.width}
                        height={anthonyImage.height}
                        alt="AI Anthony"
                        priority
                        className="aspect-square size-full"
                      />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 612 612"
                      className="absolute inset-0 group-hover:opacity-0 opacity-100 transition-opacity duration-300"
                    >
                      <path
                        fill="#fff"
                        d="M391.938 157.656c6.157-2.907 4.487-4.202 7.998 3.36 9.262 20.028-5.46 64.091-9.124 85.408l73.929 55.704c5.553 4.325 5.589 27.836-1.971 28.26-28.026-14.899-53.604-34.576-79.661-52.764l-23.466 72.245c-8.956 14.65-14.374-4.134-14.744-13.743-.462-12.347 11.696-72.74 10.002-76.184-16.598-13.541-36.309-27.339-51.329-42.461-4.184-4.221-17.191-16.022-5.205-19.116 11.987-3.094 50.764 25.011 62.501 30.654 3.142-.994 9.04-56.827 17.739-66.03 1.952-2.06 3.344-10.694 11.604-5.333h1.727Zm-146.537 48.513c6.157-2.908 13.797-6.293 17.308 1.269 9.262 20.027-13.043 62.843-16.707 84.16l73.928 55.704c5.554 4.325 5.59 27.836-1.97 28.261-28.026-14.899-53.604-34.577-79.661-52.765l-23.466 72.245c-8.957 14.65-14.374-4.134-14.744-13.743-.462-12.346 11.695-72.74 10.002-76.184-16.599-13.54-36.31-27.338-51.329-42.461-4.184-4.221-17.192-16.022-5.205-19.116 11.987-3.094 50.764 25.011 62.501 30.654 3.142-.994 12.426-53.084 21.125-62.288 1.952-2.059 5.629-4.487 8.207-5.713l.011-.023Z"
                      />
                    </svg>
                  </div>
                </TooltipOnHover>
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
    createdAt: subSeconds(new Date(), 30),
  },
  {
    id: "2",
    content: `Fomo is a studio that builds unique and polished AI experiences.`,
    role: "assistant" as const,
    createdAt: subSeconds(new Date(), 20),
  },
  {
    id: "hmmm-3-I-guess",
    content: `I'm here to talk about our studio, you can ask anything!`,
    role: "assistant" as const,
    createdAt: subSeconds(new Date(), 10),
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
  }, [messages, isMessageLoading]);

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
              onAppendUserMessageToChat={handleShortcutClick}
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
