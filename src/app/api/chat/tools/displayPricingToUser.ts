import { PlanType, PRICES_MAP } from "@/constants";
import { tool } from "ai";
import { z } from "zod";

export const displayPricingToUser = tool({
  description:
    "Get the pricing plans for the studio adapted to the user's needs. Use filterBy only if it makes sense.",
  parameters: z.object({
    filterBy: z
      .array(
        z
          .nativeEnum(PlanType)
          .optional()
          .describe("The type of pricing to get, only used when necessary")
      )
      .optional()
      .default([]),
  }),
  execute: async ({ filterBy = [] }) => {
    const plans = Object.values(PRICES_MAP).filter(
      (plan) =>
        filterBy.length === 0 || filterBy.some((value) => value === plan.type)
    );

    return plans;
  },
});
