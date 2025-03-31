"use client";

import { useState } from "react";
import { AIChat } from "./ai-chat";
import { AnimatedIntro } from "./animated-intro";

function Core({ comesFrom }: { comesFrom: string }) {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <>
      <AnimatedIntro onAnimationComplete={handleAnimationComplete} />
      <div className="flex flex-col items-center justify-center min-h-[20vh] w-screen pt-20"></div>
      {animationComplete && <AIChat comesFrom={comesFrom} />}
    </>
  );
}

export default Core;
