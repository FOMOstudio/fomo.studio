"use client";

import { AnimatedIntro } from "@/components/animated-intro";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/top-bar";
import { AIChat } from "@/components/ai-chat";

export default function Landing() {
  return (
    <>
      <TopBar />
      <AnimatedIntro />

      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div
          className={cn(
            "flex flex-col px-4 mx-auto max-w-md transition-all duration-500 ease-in-out"
          )}
        >
          <h1 className="text-xl md:text-3xl font-medium mb-6">
            <span className="text-base text-normal text-primary/50">
              We partner with founders and startups to
            </span>
            <br />
            Ship cool AI experiences.
          </h1>
          <h2 className="text-base text-primary/80 mb-8 text-balance">
            Playing with AI tools can only bring you so far, we will
            <br />
            help you ship beautiful, polished and useful AI products.
          </h2>
          <AIChat />
        </div>
      </div>
    </>
  );
}
