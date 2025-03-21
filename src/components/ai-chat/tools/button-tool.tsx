import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type Props = {
  url: string;
  caption: string;
  messageId: string;
  partIndex: number;
  callId: string;
};

export function ButtonTool({
  url,
  caption,
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
        <div className="w-full flex mx-auto max-w-md">
          <Link href={url} target="_blank">
            <Button
              size="sm"
              className="w-fit group rounded-full"
              variant={"outline"}
            >
              {caption}
              <ArrowUpRight className="size-3.5 text-primary/60 group-hover:text-primary/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
