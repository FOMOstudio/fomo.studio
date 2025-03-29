import { tool } from "ai";
import { addDays, format } from "date-fns";
import { z } from "zod";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import env from "@/env";
import { Slots } from "@/components/ai-chat/tools/cal-meeting-slots";

type CalendarResponse = {
  data: Slots;
};

// Simple retry function with exponential backoff
const axiosWithRetry = async <T>(
  url: string,
  config: AxiosRequestConfig,
  retries = 3,
  baseDelay = 1000
): Promise<AxiosResponse<T>> => {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Wait with exponential backoff before retrying
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      return await axios.get<T>(url, config);
    } catch (error) {
      lastError = error;
      console.log(
        `Attempt ${attempt + 1} failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Don't retry if it's not a network error
      if (
        axios.isAxiosError(error) &&
        !error.code?.includes("ETIMEDOUT") &&
        !error.code?.includes("ECONNABORTED") &&
        !error.code?.includes("EHOSTUNREACH")
      ) {
        throw error;
      }
    }
  }

  throw lastError;
};

export const getCalendarMeetingSlots = tool({
  description:
    "Get the calendar meeting slots of the founder of the studio, you need to provide a timezone to provide availabilities in the user's timezone.",
  parameters: z.object({
    timezone: z.string(),
    rangeInDays: z
      .number()
      .min(1)
      .max(7)
      .optional()
      .default(7)
      .describe(
        "Use rangeInDays to query for a specific range, for instance tomorrow would be 1 and in the next three days would be 3"
      ),
  }),
  execute: async ({ timezone, rangeInDays }) => {
    const refDate = new Date();

    // Create the range based on what the AI asked
    const start = format(refDate, "yyyy-MM-dd");
    const end = format(addDays(refDate, rangeInDays), "yyyy-MM-dd");

    console.log({ start, end, rangeInDays });

    if (!timezone) {
      return {
        slots: {},
        start,
        end,
      };
    }

    try {
      // Get available time slots in user's calendar and send them back to the frontend
      const url = `https://api.cal.com/v2/slots?eventTypeSlug=${env.CAL_COM_EVENT_TYPE_SLUG}&username=${env.CAL_COM_USERNAME}&start=${start}&end=${end}&timeZone=${timezone}`;

      // Use IPv4 only and increase the timeout
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${env.CAL_COM_API_KEY}`,
          "cal-api-version": "2024-09-04",
        },
        timeout: 30000, // 15 second timeout
        // Remove the lookup function as it's causing type errors
        // We'll try another approach for IPv4 only
        family: 4, // Force IPv4
      };

      // Use our retry function instead of direct axios call
      const { data } = await axiosWithRetry<CalendarResponse>(
        url,
        config,
        3,
        1000
      );

      return {
        slots: data.data,
        start,
        end,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      const errorCode =
        axios.isAxiosError(error) && error.code ? error.code : "UNKNOWN";

      const detailedError =
        axios.isAxiosError(error) && error.cause
          ? `${errorCode} - ${JSON.stringify(error.cause)}`
          : errorCode;

      console.error("error from getCalendarMeetingSlots", {
        code: errorCode,
        message: errorMessage,
        details: error,
      });

      return {
        slots: {},
        start,
        end,
        error: `Failed to connect to calendar service: ${detailedError}. Please try again later or check your network connection.`,
      };
    }
  },
});
