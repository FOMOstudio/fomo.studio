import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

export function middleware(request: NextRequest) {
  const geo = geolocation(request);

  const country = geo.country;
  const city = geo.city;
  const region = geo.countryRegion;

  const comesFrom = country || city || region || "the internet";

  // Create a new response rather than modifying the request
  const response = NextResponse.next();

  // Encode non-ASCII characters in the header value
  const encodedComesFrom = encodeURIComponent(comesFrom);

  // Set the encoded value in the header
  response.headers.set("x-comes-from", encodedComesFrom);

  return response;
}
