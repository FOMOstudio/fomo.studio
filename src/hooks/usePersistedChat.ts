import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useChat, Message, UseChatOptions } from "@ai-sdk/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

interface UsePersistedChatOptions
  extends Omit<UseChatOptions, "initialMessages"> {
  fallbackInitialMessages?: Message[];
  apiDebounceMs?: number;
}

const handleScrollToBottom = () => {
  setTimeout(() => {
    const element = document.getElementById("chat-input-anchor");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });

      window.scrollBy({
        top: 100,
        behavior: "smooth",
      });
    }
  }, 100);
};

export function usePersistedChat(options?: UsePersistedChatOptions) {
  const [inputContent, setInputContent] = useState<string>("");
  const [isLoadingData, setIsLoading] = useState(true);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const apiDebounceMs = options?.apiDebounceMs ?? 500;
  const initializedRef = useRef(false);

  // Use refs instead of state for timeout to avoid re-renders
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);

  // Fetch messages from IndexedDB
  const storedMessages = useLiveQuery(() => db.messages.toArray(), [], []);

  // Initialize chat with stored messages or fallback
  const { status, append, setMessages, stop } = useChat({
    maxSteps: 5,
    onToolCall({ toolCall }) {
      console.log({ toolCall });
    },
    ...options,
    // Only use empty array initially - we'll set proper messages after DB check
    initialMessages: [],
    async onFinish(message) {
      await db.messages.put(message);
      handleScrollToBottom();
    },
    headers: {
      "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  // Process pending messages function (not inside useEffect)
  const processPendingMessages = useCallback(async () => {
    if (pendingMessages.length === 0 || processingRef.current) return;

    processingRef.current = true;

    try {
      // If AI is currently responding, stop it
      if (status === "streaming" || status === "submitted") {
        stop();
      }

      // Take the most recent message
      const lastMessage = pendingMessages[pendingMessages.length - 1];

      // Clear pending messages
      setPendingMessages([]);

      // Send the message to API
      await Promise.all([append(lastMessage), db.messages.put(lastMessage)]);

      handleScrollToBottom();
    } finally {
      processingRef.current = false;
    }
  }, [pendingMessages, status, stop, append]);

  // Watch for pending messages and trigger processing after debounce
  useEffect(() => {
    if (pendingMessages.length > 0) {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        processPendingMessages();
      }, apiDebounceMs);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [pendingMessages, apiDebounceMs, processPendingMessages]);

  // Initialize messages from DB or fallback, but only once
  useEffect(() => {
    const initializeMessages = async () => {
      // Skip if we're still loading or already initialized
      if (storedMessages === undefined || initializedRef.current) return;

      initializedRef.current = true;

      if (storedMessages.length > 0) {
        // We have messages in DB, use those
        setMessages(storedMessages);
      } else if (options?.fallbackInitialMessages?.length) {
        // Use the atomic transaction method to safely add initial messages
        const resultMessages = await db.safelyAddInitialMessages(
          options.fallbackInitialMessages
        );
        setMessages(resultMessages);
      }

      setIsLoading(false);
    };

    initializeMessages();
  }, [storedMessages, options?.fallbackInitialMessages, setMessages]);

  // Method to reset the chat history
  const resetChatHistory = useCallback(async () => {
    await db.resetMessages();
    setMessages([]);

    if (options?.fallbackInitialMessages?.length) {
      const resultMessages = await db.safelyAddInitialMessages(
        options.fallbackInitialMessages
      );
      setMessages(resultMessages);
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

    // Add message to UI immediately but queue for API
    setPendingMessages((prev) => [...prev, message]);

    // Update stored messages for UI display
    await db.messages.put(message);

    setInputContent("");
    handleScrollToBottom();
  };

  const sortedMessages = useMemo(() => {
    if (!storedMessages) return [];

    // Create a copy of the array before sorting to avoid modifying the original
    return [...storedMessages].sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeA - timeB;
    });
  }, [storedMessages]);

  return {
    messages: sortedMessages,
    isLoadingData,
    resetChatHistory,
    handleSubmit,
    isMessageLoading:
      status === "streaming" ||
      status === "submitted" ||
      pendingMessages.length > 0,
    inputContent,
    setInputContent,
    append,
    stop,
  };
}
