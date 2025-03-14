import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const { city, country } = geolocation(request);

  const comesFrom = city || country || "the internet";

  requestHeaders.set("x-comes-from", comesFrom);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
