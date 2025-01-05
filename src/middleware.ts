import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
   '/',
   '/not-found',
   '/sign-in(.*)',
   '/sign-up(.*)',
   '/(api|trpc)(.*)'
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
   const user = auth();
   const pathname = request.nextUrl.pathname;
   const isPublicOrApiRoute = isPublicRoute(request) || pathname.startsWith('/api');

   // Allow route access if public
   if (isPublicOrApiRoute) {
      return NextResponse.next();
   }

   // Redirect to sign-in if user is not authenticated
   if (!user?.sessionId) {
      console.warn(`Unauthenticated request to: ${pathname}. Redirecting to sign-in.`);
      return NextResponse.redirect(new URL('/sign-in', request.url));
   }
});

export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
