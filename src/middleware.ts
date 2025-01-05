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

   // Fetch user data and check restrictions
   const response = await fetch(`${process.env.BASE_URL}/api/check-user-restriction`, {
      next: {
         revalidate: 3600
      },
      body: JSON.stringify({ id: user.userId }),
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      }
   });

   // Handle possible API errors
   if (!response.ok) {
      console.error(`Error fetching user data: ${response.statusText}. Redirecting to /not-found.`);
      return NextResponse.rewrite(new URL('/not-found', request.url));
   }

   const { user: userData } = await response.json();

   // Redirect to auth-callback if user data is missing
   if (!userData && !pathname.startsWith('/auth-callback')) {
      console.info(
         `User data not found for user ID: ${user.userId}. Redirecting to /auth-callback.`
      );
      return NextResponse.redirect(new URL('/auth-callback', request.url));
   }

   return NextResponse.next(); // Allow access
});

export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
