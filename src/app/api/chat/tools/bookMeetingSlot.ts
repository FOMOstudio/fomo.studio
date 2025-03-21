import { tool } from "ai";
import { z } from "zod";
import axios from "axios";
import env from "@/env";

type Response = {
  data: {
    slotDuration: number;
  };
};

export const bookMeetingSlot = tool({
  description:
    "Book a time slot in the availabilities sent previously by the tool 'getCalendarMeetingSlots', if no availabilities in the chat, use it to fetch them. If the user didn't provide an email and their name yet, ask for it before using this tool.",
  parameters: z.object({
    timezone: z.string(),
    email: z.string().email().describe("The email of the user"),
    name: z.string().describe("The name of the user"),
    slotStartDate: z
      .string()
      .describe(
        "Date in format yyyy-MM-dd to which we want to book the slot for"
      ),
    slotStartTime: z
      .string()
      .describe(
        "Time in format hours:minutes in witch we want to book to slot for"
      ),
  }),
  execute: async ({ timezone, slotStartDate, slotStartTime, email, name }) => {
    // 1: Construct the date in the correct timezone

    // 2: Transform the date from the user's timezone to UTC
    // ISO 8601 datestring in UTC timezone representing available slot.
    // Example: 2024-01-01T00:00:00Z
    const start = "";

    // 3: Book the slot
    try {
      // Get available time slots in user's calendar and send them back to the frontend
      const { data } = await axios.post<Response>(
        `https://api.cal.com/v2/bookings`,
        {
          start,
          // The event type ID to book the slot for
          eventTypeId: env.CAL_COM_EVENT_TYPE_ID,
          attendee: {
            name,
            timeZone: timezone,
            email,
            language: "en",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.CAL_COM_API_KEY}`,
            "cal-api-version": "2024-08-13",
          },
        }
      );

      return { data: data.data.slotDuration };
    } catch (error) {
      console.error("error from getCalendarMeetingSlots", error);
    }
  },
});
