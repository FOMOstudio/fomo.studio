import { TopBar } from "@/components/top-bar";
import { headers } from "next/headers";
import Core from "@/components/core";

export default async function Landing() {
  const headersList = await headers();
  const comesFrom = headersList.get("x-comes-from");

  return (
    <>
      <TopBar />
      <Core comesFrom={decodeURIComponent(comesFrom || "the internet")} />
    </>
  );
}
