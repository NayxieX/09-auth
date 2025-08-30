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

  // ================================
  // Перевірка типу маршруту
  // ================================
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ================================
  // Перевірка сесії користувача
  // ================================
  let isAuthenticated = false;
  const response = NextResponse.next(); // Стандартна відповідь

  if (accessToken || refreshToken) {
    const session = await checkSession(); // Викликаю серверний API для перевірки сесії
    isAuthenticated = session.isAuth === true;
  }

  // ================================
  // Редірект для приватних маршрутів
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
  // Редірект для публічних маршрутів (якщо користувач вже авторизований)
  // ================================
  if (isPublicRoute && isAuthenticated) {
    const redResponse = NextResponse.redirect(new URL("/", request.url));
    // Переношу всі куки у новий редірект
    response.cookies.getAll().forEach((cook) => {
      redResponse.cookies.set(cook);
    });
    return redResponse;
  }

  // ================================
  // Повертає стандартну відповідь
  // ================================
  return response;
}

// ================================
// Конфігурація matcher
// ================================
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
