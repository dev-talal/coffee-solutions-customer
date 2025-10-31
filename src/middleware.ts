import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoute = ["/profile", "/wishlist"];
const authRoutes = ["/auth/login", "/auth/forgot-password"];

function stripLocale(pathname: string) {
  const parts = pathname.split("/");
  if (parts.length > 1 && /^[a-z]{2}$/.test(parts[1])) {
    return "/" + parts.slice(2).join("/");
  }
  return pathname;
}

async function verifyToken(token: string | undefined) {
  if (!token) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data?.success === true;
  } catch (e) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(
    process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
  )?.value;

  const { pathname } = req.nextUrl;
  const cleanPath = stripLocale(pathname);

  const isValid = await verifyToken(token);

  if (authRoutes.includes(cleanPath)) {
    if (isValid) {
      return NextResponse.redirect(
        new URL(`/${req.nextUrl.locale || "en"}/profile`, req.url)
      );
    }
    return NextResponse.next();
  }

  if (!isValid && protectedRoute.includes(cleanPath)) {
    return NextResponse.redirect(
      new URL(`/${req.nextUrl.locale || "en"}/auth/login`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
