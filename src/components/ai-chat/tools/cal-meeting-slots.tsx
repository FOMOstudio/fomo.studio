import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { format } from "date-fns";

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
  onAddMeetingSlotToChat: (slot: string) => void;
};

export function CalMeetingSlotsTool({
  slots,
  messageId,
  partIndex,
  callId,
  onAddMeetingSlotToChat,
}: Props) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), "h:mm a");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d");
  };

  const handleAddMeetingSlotToChat = (date: string, slot: string) => {
    const formattedSlot = `${formatDate(date)} at ${formatTime(slot)} `;

    onAddMeetingSlotToChat(formattedSlot);
  };

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
        <div
          className={cn(
            "md:max-w-md mx-auto p-4 bg-primary/5 rounded-xl w-full"
          )}
        >
          {Object.entries(slots).map(([date, timeSlots]) => {
            const isExpanded = expandedDays.has(date);
            const displaySlots = isExpanded ? timeSlots : timeSlots.slice(0, 5);
            const hasMoreSlots = timeSlots.length > 5;

            return (
              <div key={date} className="mb-8 last:mb-0">
                <h3 className="text-sm font-medium text-primary mb-2">
                  {formatDate(date)}
                </h3>
                <div className="space-x-1 space-y-1">
                  {displaySlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleAddMeetingSlotToChat(date, slot.start)
                      }
                    >
                      {formatTime(slot.start)}
                    </Button>
                  ))}
                </div>
                {hasMoreSlots && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => toggleDay(date)}
                  >
                    {isExpanded
                      ? "Show less"
                      : `Show ${timeSlots.length - 5} more`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
