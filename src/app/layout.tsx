import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import TrpcProvider from '@/lib/trpc/Provider';
import { cookies } from 'next/headers';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
   title: 'COC Timer',
   description: 'COC timer created by Bernard Sapida'
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="min-h-screen dark">
            <NextUIProvider>
               <ClerkProvider>
                  <TrpcProvider cookies={cookies().toString()}>
                     <main className="p-10">
                        {children}
                        <Toaster
                           richColors
                           data-cy="toaster"
                           position="top-center"
                        />
                     </main>
                  </TrpcProvider>
               </ClerkProvider>
            </NextUIProvider>
         </body>
      </html>
   );
}
