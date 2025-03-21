import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";
import { headers } from "next/headers";

import { getCalendarMeetingSlots } from "./tools/getCalendarMeetingSlots";
import { displayPricingToUser } from "./tools/displayPricingToUser";
import { getSystemPrompt } from "./prompt";
import { displayLinkButtonToUser } from "./tools/displayLinkButtonToUser";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create a new ratelimiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

export async function POST(req: Request) {
  const identifier = "chat-api";

  // Get the timezone from the headers, its being sent by the frontend
  const headersList = await headers();
  const timezone = headersList.get("X-Timezone");

  // Rate limit the request to 5 requests per 10 seconds
  const { success, limit, remaining, pending } = await ratelimit.limit(
    identifier
  );

  const response = {
    success: success,
    limit: limit,
    remaining: remaining,
  };

  const { messages } = await req.json();

  // Send analytics to Upstash
  waitUntil(pending);

  if (!success) {
    return new Response(JSON.stringify(response), { status: 429 });
  }

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: getSystemPrompt({ timezone }),
    onError: (error) => {
      console.error("error from streamText", error);
    },
    tools: {
      displayPricingToUser,
      getCalendarMeetingSlots,
      displayLinkButtonToUser,
    },
  });

  return result.toDataStreamResponse();
}
