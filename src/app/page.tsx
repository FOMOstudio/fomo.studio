import { AnimatedIntro } from "@/components/animated-intro";
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

      <div className="flex flex-col items-center justify-center min-h-[20vh] w-screen pt-20"></div>
      <AIChat comesFrom={comesFrom} />
    </>
  );
}
