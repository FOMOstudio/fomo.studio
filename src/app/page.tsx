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

      <div className="flex flex-col items-center justify-center min-h-screen w-screen pt-20">
        <div
          className={cn(
            "flex flex-col mx-auto w-full md:max-w-md transition-all duration-500 ease-in-out"
          )}
        >
          <h1 className="text-xl md:text-3xl font-bold mb-6">
            <span className="text-base text-normal text-primary/60">
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
        </div>
        <AIChat comesFrom={comesFrom} />
      </div>
    </>
  );
}
