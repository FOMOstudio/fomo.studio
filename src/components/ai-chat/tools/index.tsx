"use client";

import { Plan } from "@/constants";
import { Message } from "@ai-sdk/react";
import React from "react";
import { PricingTool } from "./pricing";

type Props = {
  messageId: string;
  messageParts: Message["parts"];
};

export function AIMessageToolDisplay({ messageParts, messageId }: Props) {
  if (!messageParts) return <></>;

  return (
    <>
      {messageParts.map((part, partIndex) => {
        if (!part || !("type" in part))
          return <React.Fragment key={`${messageId}-part-${partIndex}`} />;

        if (part.type !== "tool-invocation")
          return <React.Fragment key={`${messageId}-part-${partIndex}`} />;

        const toolInvocation = part.toolInvocation;
        const callId = toolInvocation.toolCallId;

        switch (toolInvocation.toolName) {
          case "displayPricingToUser": {
            switch (toolInvocation.state) {
              case "call":
                return (
                  <div key={`${messageId}-part-${partIndex}-${callId}-call`}>
                    <p>Loading pricing...</p>
                  </div>
                );
              case "result":
                const plans = toolInvocation.result as Plan[];

                return (
                  <PricingTool
                    key={`${messageId}-part-${partIndex}-${callId}-result`}
                    plans={plans}
                    messageId={messageId}
                    partIndex={partIndex}
                    callId={callId}
                  />
                );
            }
            break;
          }
        }
      })}
    </>
  );
}
