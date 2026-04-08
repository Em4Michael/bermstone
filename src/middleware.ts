import { NextRequest, NextResponse } from "next/server";

// Set NEXT_PUBLIC_ROOT_DOMAIN in your .env / Vercel env vars
// e.g. bermstone.com  or  bermstone.vercel.app
const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bermstone.vercel.app";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get("host") || "").split(":")[0]; // strip port
  const path = url.pathname;

  // Skip Next.js internals and static files
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") // static files like favicon.ico, images
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  // bermstone.com           → subdomain = ''  (root)
  // keyneet.bermstone.com   → subdomain = 'keyneet'
  // www.bermstone.com       → subdomain = 'www'  (treat as root)
  const subdomain = hostname
    .replace(`.${ROOT_DOMAIN}`, "")
    .replace(`www.${ROOT_DOMAIN}`, "")
    .replace(ROOT_DOMAIN, "");

  const isRoot =
    subdomain === "" || subdomain === "www" || hostname === "localhost";

  // ── Root domain: normal site ─────────────────────────────────
  if (isRoot) return NextResponse.next();

  // ── keyneet subdomain ─────────────────────────────────────────
  // keyneet.bermstone.com/         → /keyneet
  // keyneet.bermstone.com/abc      → /keyneet/abc
  if (subdomain === "keyneet" || subdomain === "keyneest") {
    if (path === "/") {
      url.pathname = "/keyneet";
    } else if (!path.startsWith("/keyneet")) {
      url.pathname = `/keyneet${path}`;
    }
    return NextResponse.rewrite(url);
  }

  // ── investments subdomain ─────────────────────────────────────
  // investments.bermstone.com/     → /investments
  // investments.bermstone.com/abc  → /investments/abc
  if (subdomain === "investments" || subdomain === "invest") {
    if (path === "/") {
      url.pathname = "/investments";
    } else if (!path.startsWith("/investments")) {
      url.pathname = `/investments${path}`;
    }
    return NextResponse.rewrite(url);
  }

  // Unknown subdomain — redirect to root
  url.hostname = ROOT_DOMAIN;
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Run on every request except Next.js internal routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
