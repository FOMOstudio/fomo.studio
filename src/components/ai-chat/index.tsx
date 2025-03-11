"use client";

import { useChat } from "@ai-sdk/react";
import { MainPromptInput } from "./main-prompt-input";
import { FormEvent, ChangeEvent } from "react";

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

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

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <MainPromptInput
        value={input}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
