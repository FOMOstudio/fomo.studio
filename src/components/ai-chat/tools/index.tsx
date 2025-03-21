"use client";

import { Plan } from "@/constants";
import { Message } from "@ai-sdk/react";
import React from "react";
import { PricingTool } from "./pricing";
import { ButtonTool } from "./button-tool";
import { CalMeetingSlotsTool, Slots } from "./cal-meeting-slots";

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
          case "displayPricingToUser":
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

          case "displayLinkButtonToUser":
            switch (toolInvocation.state) {
              case "result":
                const plans = toolInvocation.result as {
                  url: string;
                  caption: string;
                };

                return (
                  <ButtonTool
                    key={`${messageId}-part-${partIndex}-${callId}-result`}
                    url={plans.url}
                    caption={plans.caption}
                    messageId={messageId}
                    partIndex={partIndex}
                    callId={callId}
                  />
                );
            }
            break;

          case "getCalendarMeetingSlots":
            switch (toolInvocation.state) {
              case "call":
                return (
                  <div key={`${messageId}-part-${partIndex}-${callId}-call`}>
                    <p>I&apos;m looking for a time</p>
                  </div>
                );
              case "result":
                const result = toolInvocation.result as {
                  slots: Slots;
                  start: string;
                  end: string;
                };

                return (
                  <CalMeetingSlotsTool
                    key={`${messageId}-part-${partIndex}-${callId}-result`}
                    slots={result.slots}
                    messageId={messageId}
                    partIndex={partIndex}
                    callId={callId}
                  />
                );
            }
            break;
        }
      })}
    </>
  );
}
