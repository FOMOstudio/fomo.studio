"use client";

import { Plan } from "@/constants";
import { Message } from "@ai-sdk/react";
import { ToolInvocation } from "ai";

type Props = {
  messageParts: Message["parts"][];
};

export function AIMessageToolDisplay({ messageParts }: Props) {
  if (!messageParts) return <></>;

  return (
    <>
      {messageParts.map((part) => {
        if (!part || !("type" in part)) return <></>;

        if (part.type !== "tool-invocation") return <></>;

        const toolInvocation = part as unknown as ToolInvocation;

        console.log({ toolInvocation });

        const callId = toolInvocation.toolCallId;

        switch (toolInvocation.toolName) {
          case "displayPricingToUser": {
            switch (toolInvocation.state) {
              case "call":
                return (
                  <div key={callId}>
                    <p>Loading pricing...</p>
                  </div>
                );
              case "result":
                const plans = toolInvocation.result as Plan[];

                return (
                  <div key={callId}>Plans found: {JSON.stringify(plans)}</div>
                );
            }
            break;
          }
        }
      })}
    </>
  );
}
