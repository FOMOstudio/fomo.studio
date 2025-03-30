import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

export function middleware(request: NextRequest) {
  const geo = geolocation(request);

  const country = geo.country;
  const city = geo.city;
  const region = geo.countryRegion;

  const comesFrom = city || country || region || "the internet";

  // Create a new response rather than modifying the request
  const response = NextResponse.next();

  // Set the header on the response instead
  response.headers.set("x-comes-from", comesFrom);

  return response;
}
