import { Button } from "@/components/ui/button";
import { Plan } from "@/constants";
import { motion } from "motion/react";

type Props = {
  plans: Plan[];
  messageId: string;
  partIndex: number;
  callId: string;
};

export function PricingTool({ plans, messageId, partIndex, callId }: Props) {
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
        <div className="w-full md:w-fit md:h-fit flex flex-col md:flex-row gap-3 mx-auto mb-3">
          {plans.map((plan) => (
            <div
              className="w-full md:w-88 min-w-68 rounded-xl flex flex-col gap-4 justify-between p-4 bg-primary/5"
              key={`${messageId}-part-${partIndex}-plan-${plan.type}-${plan.interval}`}
            >
              <div className="flex items-center gap-2">
                <p className="text-base text-primary font-medium">
                  {plan.title}
                </p>
                <p className="text-base text-primary/60">{plan.price}</p>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-base text-primary/60">{plan.description}</p>
              </div>
              <Button size="sm" className="w-fit">
                Select
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
