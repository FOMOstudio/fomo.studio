"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { TextScramble } from "./text-scramble";

export function AnimatedIntro({
  onAnimationComplete,
}: {
  onAnimationComplete?: () => void;
}) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const colorScheme = { bg: "bg-primary", text: "text-primary-foreground" };

  useEffect(() => {
    const doneTimer = setTimeout(() => {
      setIsDone(true);
      if (onAnimationComplete) onAnimationComplete();
    }, 3000);

    return () => {
      clearTimeout(doneTimer);
    };
  }, [onAnimationComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed inset-0 z-[9500] flex items-center justify-center w-screen h-screen",
          colorScheme.bg,
          colorScheme.text
        )}
        initial={{ opacity: 1 }}
        animate={{ scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            key="do-not-fomo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-7xl md:text-9xl font-bold mb-4"
          >
            <TextScramble>do not fomo</TextScramble>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
