import { AnimatedIntro } from "@/components/animated-intro";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/top-bar";
import { AIChat } from "@/components/ai-chat";
import { headers } from "next/headers";

export default async function Landing() {
  // After
  const headersList = await headers();
  const comesFrom = headersList.get("x-comes-from");

  return (
    <>
      <TopBar />
      <AnimatedIntro />

      <div className="flex flex-col items-center justify-center min-h-[20vh] w-screen pt-20">
        <div
          className={cn(
            "flex flex-col mx-auto w-full md:max-w-md transition-all duration-500 ease-in-out px-6 md:px-0"
          )}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary/60 text-balance md:leading-normal">
            Stop vibe coding.
            <br />
            Do not <span className="text-primary">Fomo</span>.<br />
            We will ship it for you.
          </h1>
        </div>
      </div>
      <AIChat comesFrom={comesFrom} />
    </>
  );
}
