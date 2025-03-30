"use client";

import { AnimatedIntro } from "@/components/animated-intro";
import { TopBar } from "@/components/top-bar";
import { AIChat } from "@/components/ai-chat";
import { useState, useEffect } from "react";

export default function Landing() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [comesFrom, setComesFrom] = useState<string | null>(null);

  // Using headers in a client component requires an async function
  async function getHeaders() {
    const res = await fetch("/api/headers");
    const data = await res.json();
    return data.comesFrom;
  }

  // Fetch headers when component mounts
  useEffect(() => {
    getHeaders().then((comesFrom) => setComesFrom(comesFrom));
  }, []);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <>
      <TopBar />
      <AnimatedIntro onAnimationComplete={handleAnimationComplete} />

      <div className="flex flex-col items-center justify-center min-h-[20vh] w-screen pt-20"></div>

      {animationComplete && <AIChat comesFrom={comesFrom} />}
    </>
  );
}
