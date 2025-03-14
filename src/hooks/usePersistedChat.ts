import { useState, useEffect, useCallback, useMemo } from "react";
import { useChat, Message, UseChatOptions } from "@ai-sdk/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

interface UsePersistedChatOptions
  extends Omit<UseChatOptions, "initialMessages"> {
  fallbackInitialMessages?: Message[];
}

export function usePersistedChat(options?: UsePersistedChatOptions) {
  const [isLoadingData, setIsLoading] = useState(true);

  // Fetch messages from IndexedDB
  const storedMessages = useLiveQuery(() => db.messages.toArray(), [], []);

  // Initialize chat with stored messages or fallback
  const { status, append, setMessages } = useChat({
    ...options,
    initialMessages: storedMessages?.length
      ? storedMessages
      : options?.fallbackInitialMessages || [],
    async onFinish(message) {
      await db.messages.put(message);
    },
  });

  // Set loading to false once we have the initial data
  useEffect(() => {
    if (storedMessages !== undefined) {
      setIsLoading(false);
    }
  }, [storedMessages]);

  // Method to reset the chat history
  const resetChatHistory = useCallback(async () => {
    await db.resetMessages();
    setMessages([]);
    // Reset the chat state to initial state
    if (options?.fallbackInitialMessages) {
      // Add the fallback messages to the database
      // Use put instead of add to handle potential duplicate keys
      await db.messages.bulkPut(options.fallbackInitialMessages);
    }
  }, [options?.fallbackInitialMessages, setMessages]);

  const handleSubmit = async (messageContent: string) => {
    const messageId = `user-${Date.now().toString()}`;

    const message: Message = {
      content: messageContent,
      id: messageId,
      role: "user",
      createdAt: new Date(),
    };

    await Promise.all([append(message), db.messages.put(message)]);
  };

  const sortedMessages = useMemo(() => {
    return storedMessages?.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }, [storedMessages]);

  return {
    messages: sortedMessages,
    isLoadingData,
    resetChatHistory,
    handleSubmit,
    isMessageLoading: status === "streaming" || status === "submitted",
  };
}
