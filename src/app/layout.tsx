import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import TrpcProvider from '@/lib/trpc/Provider';
import { cookies } from 'next/headers';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'sonner';

import './globals.css';
import MenuBar from '@/components/Navbar';

export const metadata: Metadata = {
   title: 'File Management',
   description: 'File Management created by Xyp Escader'
};

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className="min-h-screen">
            <NextUIProvider>
               <ClerkProvider>
                  <TrpcProvider cookies={cookies().toString()}>
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
