import { tool } from "ai";
import { z } from "zod";

export const displayLinkButtonToUser = tool({
  description:
    "Use this tool to display a link button to the user. The button could be a link to the pricing page, social account or to things the studio worked on.",
  parameters: z.object({
    url: z.string().describe("The URL to redirect the user to"),
    caption: z.string().describe("The text to display on the button"),
  }),
  execute: async ({ url, caption }) => {
    return {
      url,
      caption,
    };
  },
});
