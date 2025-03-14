import { useState, useEffect, useCallback } from "react";
import { useChat, Message, UseChatOptions } from "@ai-sdk/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

interface UsePersistedChatOptions
  extends Omit<UseChatOptions, "initialMessages"> {
  fallbackInitialMessages?: Message[];
}

export function usePersistedChat(options?: UsePersistedChatOptions) {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from IndexedDB
  const storedMessages = useLiveQuery(() => db.messages.toArray(), [], []);

  // Initialize chat with stored messages or fallback
  const { messages, handleInputChange, handleSubmit, input } = useChat({
    ...options,
    initialMessages: storedMessages?.length
      ? storedMessages
      : options?.fallbackInitialMessages || [],
  });

  // Sync messages to IndexedDB whenever they change
  useEffect(() => {
    // Only sync completed messages to avoid issues with streaming
    if (!isLoading && messages.length > 0) {
      const syncMessages = async () => {
        try {
          // Get existing message IDs
          const existingIds = new Set(
            (await db.messages.toArray()).map((m) => m.id)
          );

          // Add new messages to the database, but only if they're complete (not streaming)
          const newMessages = messages.filter((m) => !existingIds.has(m.id));

          if (newMessages.length > 0) {
            // Use bulkPut instead of bulkAdd to handle duplicate keys
            await db.messages.bulkPut(newMessages);
          }
        } catch (error) {
          console.error("Error syncing messages to IndexedDB:", error);
        }
      };

      syncMessages();
    }
  }, [messages, isLoading]);

  // Set loading to false once we have the initial data
  useEffect(() => {
    if (storedMessages !== undefined) {
      setIsLoading(false);
    }
  }, [storedMessages]);

  // Method to reset the chat history
  const resetChatHistory = useCallback(async () => {
    await db.resetMessages();
    // Reset the chat state to initial state
    if (options?.fallbackInitialMessages) {
      // Add the fallback messages to the database
      // Use put instead of add to handle potential duplicate keys
      await db.messages.bulkPut(options.fallbackInitialMessages);
    }
  }, [options?.fallbackInitialMessages]);

  return {
    messages,
    isLoading,
    resetChatHistory,
    handleInputChange,
    handleSubmit,
    input,
  };
}
