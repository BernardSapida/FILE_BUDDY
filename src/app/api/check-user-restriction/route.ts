import { db } from '@/lib/db/index';

export async function POST(request: Request) {
   const data = await request.json();
   const userId = data.id;
   const user = await db.user.findFirst({
      where: { clerkUserId: userId }
   });

   // Return user object
   if (user) {
      return Response.json({ status: 200, user: user });
   }

   return Response.json({ status: 404 });
}
