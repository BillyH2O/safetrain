import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes publiques autorisées
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/", // Inclure la route principale
    "/sign-in",
    "/sign-up",
    "/[...url]", // Inclure toutes les routes dynamiques
    "/((?!_next/static|favicon.ico|[^?]*\\.(?:js|css|json|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|otf|eot|ico|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
