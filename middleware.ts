import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/api/auth/signin",  
  "/api/auth/signup",
  "/api/auth/signout",
  "/api/website",
  "/home"
];

// List of routes that require authentication
// If user is not authenticated, they will be redirected to sign-in page
const authRoutes = [
  "/dashboard",
  "/edit"
];

export default authMiddleware({
  publicRoutes: publicRoutes,
  afterAuth(auth, req) {
    // If user is not authenticated and trying to access a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      const { pathname } = req.nextUrl;
      
      // See if the current path is included in authRoutes
      const isAuthRoute = authRoutes.some(route => 
        pathname.startsWith(route) || pathname === route
      );
      
      if (isAuthRoute) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
    }

    // For authenticated users, sync with our database if needed
    if (auth.userId && !auth.isPublicRoute) {
      // Here you could add code to sync Clerk user data with your database
      // This could be done via an API call or directly here
      // For example: syncUserWithDatabase(auth.userId, auth.user);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 