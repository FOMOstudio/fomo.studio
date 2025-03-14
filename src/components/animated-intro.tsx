"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function AnimatedIntro() {
  const [step, setStep] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isLogoMoving, setIsLogoMoving] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else if (step === 3) {
        setIsLogoMoving(true);
        setTimeout(() => {
          setIsDone(true);
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step]);

  const isDarkBackground = step % 2 === 0;

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed inset-0 z-[9500] flex items-center justify-center w-screen h-screen transition-colors duration-500",
          isDarkBackground ? "bg-black text-white" : "bg-white text-black"
        )}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="do"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-7xl md:text-9xl font-bold mb-4"
              >
                DO
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="not"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-7xl md:text-9xl font-bold mb-4"
              >
                NOT
              </motion.div>
            )}

            {step === 3 && !isLogoMoving && (
              <motion.div
                key="fomo-logo"
                className="text-7xl md:text-9xl font-bold mb-4"
                initial={{ opacity: 0, y: 10, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                FOMO
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
