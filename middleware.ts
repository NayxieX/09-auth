import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";
import { cookies } from "next/headers";

// ================================
// Конфігурація маршрутів
// ================================
const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

// ================================
// Middleware
// ================================
export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let isAuthenticated = false;
  const response = NextResponse.next();

  // ================================
  // Логіка сесії
  // ================================
  if (accessToken || refreshToken) {
    const session = await checkSession();
    const setCookieHeader = session.headers["set-cookie"];
    if (setCookieHeader) {
      const cookiesArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      cookiesArray.forEach((cookiesStr) => {
        const [cookieName, ...rest] = cookiesStr.split("=");
        const cookieValue = rest.join("=").split(";")[0]?.trim();
        if (cookieName && cookieValue) {
          response.cookies.set(cookieName.trim(), cookieValue);
        }
      });
    }
    isAuthenticated = session.status === 200 && session.data.isAuth === true;
  }

  // ================================
  // Приватні маршрути
  // ================================
  if (isPrivateRoute && !isAuthenticated) {
    if (!accessToken && !refreshToken) {
      const responseRed = NextResponse.redirect(
        new URL("/sign-in", request.url)
      );
      responseRed.cookies.delete("accessToken");
      responseRed.cookies.delete("refreshToken");
      return responseRed;
    }
  }

  // ================================
  // Публічні маршрути
  // ================================
  if (isPublicRoute && isAuthenticated) {
    const redResponse = NextResponse.redirect(new URL("/", request.url));
    response.cookies.getAll().forEach((cook) => {
      redResponse.cookies.set(cook);
    });
    return redResponse;
  }

  return response;
}

// ================================
// Конфіг matcher
// ================================
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
