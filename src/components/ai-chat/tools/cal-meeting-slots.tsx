import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type Slots = {
  // Date in YYYY-MM-DD format
  [key: string]: {
    // Time available in the
    start: string;
  }[];
};

type Props = {
  slots: Slots;
  messageId: string;
  partIndex: number;
  callId: string;
};

export function CalMeetingSlotsTool({
  slots,
  messageId,
  partIndex,
  callId,
}: Props) {
  return (
    <>
      <motion.div
        className={`mt-4 flex items-center justify-center w-full`}
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        key={`${messageId}-part-${partIndex}-${callId}-result`}
      >
        <div className={cn("w-full md:max-w-md md:w-full mx-auto")}>
          <pre>{JSON.stringify(slots, null, 2)}</pre>
        </div>
      </motion.div>
    </>
  );
}
