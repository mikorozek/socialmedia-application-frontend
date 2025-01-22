import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

type PublicPath = "/login" | "/register" | "/";
const PUBLIC_PATHS: PublicPath[] = ["/login", "/register", "/"];
const PUBLIC_PREFIXES = [
  "/api/verify",
  "/api/auth",
  "_next",
  "/static",
  "/images",
  "/public",
] as const;

function isPublicPath(path: string) {
  if (PUBLIC_PATHS.includes(path as PublicPath)) {
    return true;
  }
  if (PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return true;
  }
  if (path.match(/\.(jpg|jpeg|png|gif|svg|ico)$/)) {
    return true;
  }
  return false;
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const path = req.nextUrl.pathname;

    console.log("Middleware processing:", {
      path,
      isPublic: isPublicPath(path),
      hasToken: !!req.nextauth.token,
      token: req.nextauth.token,
    });

    if (path.startsWith("/api/")) {
      if (isPublicPath(path)) {
        return NextResponse.next();
      }

      if (!req.nextauth.token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("user-id", req.nextauth.token.id as string);
      requestHeaders.set("x-auth-timestamp", Date.now().toString());

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (isPublicPath(path)) {
      if (req.nextauth.token && !path.match(/\.(jpg|jpeg|png|gif|svg|ico)$/)) {
        return NextResponse.redirect(new URL("/conversations", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        console.log("Auth check:", {
          path,
          isPublic: isPublicPath(path),
          hasToken: !!token,
        });
        return isPublicPath(path) || !!token;
      },
    },
  },
);
