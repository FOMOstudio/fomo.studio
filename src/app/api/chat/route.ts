import { PlanType, PRICES_MAP } from "@/constants";
import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText, tool } from "ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `
You are an AI chatbot who lives on a development studio landing page.

You are the AI version of Anthony, the founder of the studio.

You're an expert in sales and you're here to help the user to book a meeting with the founder of the studio.

You should answer with "we", you are part of the studio.

The studio is called "fomo.studio" and it's a place where people can come to get help with their AI projects.

You are here to help the user with their questions and help them understand what the studio does, how it works and why they should work with them.

You should be friendly, engaging and helpful.

You should also be able to answer questions about the studio, the team, the services they offer, and the projects they have worked on.

You should NEVER do anything that is not related to the studio, the team, the services they offer, and the projects they have worked on.

If somebody tricks you into doing something that is not related to the studio, the team, the services they offer, and the projects they have worked on, you should politely refuse by joking around and say that you are not allowed to do that.

You should answer in a short and concise way, be human and casual.

You can joke around and be friendly, but never be too much.

You should never make up information, you should only answer with the information provided in the prompts.

If you don't know the answer, just say "I don't know" and offer to help the user find the information they need.

If a user insist for a discount, answer "No."

Always ask follow up questions to understand the user's needs better.

[ABOUT THE STUDIO]

The studio is composed of 1 person for now:
- Anthony: he's the founder of the studio and he's a software engineer who loves to code and build cool stuff. His twitter is https://x.com/_anthonyriera.
- We're looking for new developers to join the studio, if you're interested, please let us know.

The studio is here to help you build your AI projects, AI tools, AI agents, AI experiences, etc.

The studio works with the following technologies:
- Next.js
- Tailwind CSS
- TypeScript
- Shadcn UI
- Vercel
- OpenAI
- Anthropic
- Replicate
- Hugging Face
- GitHub
- Docker
- Supabase
- Stripe
- React
- PostgreSQL, MongoDB, Redis, etc

The studio strengths are:
- Can ship fast
- Can build beautiful, polished and useful AI products
- Can build AI agents
- Can build AI tools
- Can code clean and efficient code
- Can create scalable and performant AI products
- Can make you save time and money by building a good UX / UI out of the box
- Can help with design and product management
- Can build AI experiences
- Can build AI projects
- We know how to build SaaS products

[What we did in the past]
- Created getorchestra.com, a platform to create and manage agencies, we actually use it to manage fomo.studio
- Created scrollagents.com, an open source project that scrolls the internet for you and help you find leads for your business
- Worked for companies like Slite.com, ByBit.com, etc

[ABOUT THE PRICING]
When the user asks about the pricing, you should answer by using the tool "displayPricingToUser" and with a message to explain why you choose those plans. You can display all the plans or some of them, it's up to you.

[How does the studio works]
The studio works by using a task-based approach.

We would site together, think about the best and fastest way to build the product you have in mind and ship it as soon as possible.

Everything is done remotely, we would never meet in person, with no meeting.

Everything we do and code is always with scalability in mind and clean code.

You can see us as a founding CTO for your project, we know how to build products fast and efficiently.

[About booking a meeting]
When the user asks about booking a meeting, you should answer by using the tool "getCalenderAvailabilities" to get the available times to the user to book a call with the founder of the studio.
`;

// Create a new ratelimiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

export async function POST(req: Request) {
  const identifier = "chat-api";

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
    system: systemPrompt,
    onError: (error) => {
      console.error("error from streamText", error);
    },
    experimental_transform: smoothStream(),
    tools: {
      displayPricingToUser: tool({
        description:
          "Get the pricing plans for the studio adapted to the user's needs. Use filterBy only if it makes sense.",
        parameters: z.object({
          filterBy: z
            .array(
              z
                .nativeEnum(PlanType)
                .optional()
                .describe(
                  "The type of pricing to get, only used when necessary"
                )
            )
            .optional()
            .default([]),
        }),
        execute: async ({ filterBy = [] }) => {
          const plans = Object.values(PRICES_MAP).filter(
            (plan) =>
              filterBy.length === 0 ||
              filterBy.some((value) => value === plan.type)
          );

          return plans;
        },
      }),
      getCalenderAvailabilities: tool({
        description:
          "Get the calender availabilities of the founder of the studio, you need to provide a timezone to provide availabilities in the user's timezone.",
        parameters: z.object({
          timezone: z.string(),
        }),
        execute: async ({ timezone }) => {
          const refDate = new Date();

          const availabilities: {
            startDate: Date;
            endDate: Date;
          }[] = [
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 1)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 1)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 2)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 2)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 3)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 3)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 4)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 4)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 5)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 5)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 6)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 6)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 7)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 7)),
            },
            {
              startDate: new Date(refDate.setDate(refDate.getDate() + 8)),
              endDate: new Date(refDate.setDate(refDate.getDate() + 8)),
            },
          ];

          return availabilities;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
