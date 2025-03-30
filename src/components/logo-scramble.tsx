"use client";
import { useState } from "react";
import { TextScramble } from "./text-scramble";
import Link from "next/link";

export function LogoScramble() {
  const [isTrigger, setIsTrigger] = useState(false);

  return (
    <Link href="/" className="text-primary">
      <TextScramble
        className="text-lg font-medium font-mono"
        as="span"
        speed={0.01}
        trigger={isTrigger}
        onHoverStart={() => setIsTrigger(true)}
        onScrambleComplete={() => setIsTrigger(false)}
      >
        fomostudio
      </TextScramble>
    </Link>
  );
}
