import { NextRequest, NextResponse } from "next/server";
import { incr } from "./lib/rateLimitStore";

const MAX_REQUESTS = 3;

const getClientIp = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || req.headers.get("x-client-ip") || "unknown";
};

const shouldSkip = (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (pathname.startsWith("/studio")) return true;
  if (pathname.startsWith("/api/stripe/webhook") && req.headers.get("stripe-signature")) {
    return true;
  }
  return false;
};

// Rate-store cleanup handled inside the store implementation (in-memory fallback).

export async function middleware(req: NextRequest) {
  if (shouldSkip(req)) {
    return NextResponse.next();
  }

  const ip = getClientIp(req);
  const key = ip;
  const now = Date.now();

  const current = await incr(key);

  if (current.count > MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return new NextResponse("Too many requests", {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
