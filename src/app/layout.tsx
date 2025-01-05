import TrpcProvider from '@/lib/trpc/Provider';
import { ClerkProvider } from '@clerk/nextjs';
import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import MenuBar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
   title: 'File Buddy',
   description: 'File Management created by Xyp Escader group'
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         {/* dark */}
         <body className="min-h-screen">
            <NextUIProvider>
               <ClerkProvider>
                  <TrpcProvider cookies={cookies().toString()}>
                     <NextTopLoader showSpinner={false} />
                     <main>
                        <MenuBar />
                        {children}
                        <Toaster
                           richColors
                           data-cy="toaster"
                           position="bottom-right"
                        />
                     </main>
                  </TrpcProvider>
               </ClerkProvider>
            </NextUIProvider>
         </body>
      </html>
   );
}
