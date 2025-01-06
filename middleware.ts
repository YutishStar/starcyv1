// import { useAuth } from "@clerk/nextjs";
import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const client = clerkClient();
  if (!userId && !isPublicRoute(request)) {
    (await auth()).protect();
    // return redirectToSignIn({ returnBackUrl: request.url });
  }

  if (
    userId &&
    !(await client.users.getUser(userId)).publicMetadata.is_onboarded &&
    request.nextUrl.pathname !== '/onboarding'
  ) {
    console.log((await client.users.getUser(userId)).publicMetadata.is_onboarded);
    const onboardingUrl = new URL('/onboarding', request.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if(userId && request.nextUrl.pathname === '/onboarding') {
    if((await client.users.getUser(userId)).publicMetadata.is_onboarded) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  

 

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(request)) {
    return NextResponse.next()
  }
  // if (!isPublicRoute(request)) {
  //   const { getToken, userId } = auth();

  //   // const token = await getToken();
  //   const user = await clerkClient().users.getUser(userId ?? "");

  //     const isOnboarded = user.publicMetadata.is_onboarded;
  //     console.log("isOnboarded:::::", isOnboarded);
  //     if (isOnboarded) {
  //       return Response.redirect(new URL("/", request.url));
  //     }
  //   }
  // else {
  //   auth().protect();
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // "/api/webhooks(.*)",
    // Ensure the middleware matches the /api/onboarding route
    // "/api/onboarding(.*)",
    // "/api/clerk-webhook(.*)",
  ],
};
//import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
//
//const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
//
//export default clerkMiddleware((auth, request) => {
//  if (!isPublicRoute(request)) {
//    auth().protect()
//  }
//})
//
//export const config = {
//  matcher: [
//    // Skip Next.js internals and all static files, unless found in search params
//    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//    // Always run for API routes
//    '/(api|trpc)(.*)',
//  ],
//}
