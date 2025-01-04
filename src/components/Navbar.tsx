'use client';

import { getLinksForRole } from '@/config/nav';
import { UserButton, useUser } from '@clerk/nextjs';
import {
   Avatar,
   Badge,
   Button,
   Navbar,
   NavbarBrand,
   NavbarContent,
   NavbarItem,
   NavbarMenu,
   NavbarMenuItem,
   NavbarMenuToggle,
   Skeleton
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx';
import { UserContext } from './UserContextWrapper';

export default function Menubar() {
   const pathname = usePathname();
   const { user: loggedUser } = useContext(UserContext);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   let { isSignedIn, user, isLoaded } = useUser();
   let menu = getLinksForRole(
      // loggedUser?.type as Role
      'user'
   );

   return (
      <Navbar
         onMenuOpenChange={setIsMenuOpen}
         isMenuOpen={isMenuOpen}
         maxWidth="xl"
         className={`${pathname == '/analysis-report' && 'hidden'} h-[80px]`}
      >
         <NavbarContent>
            <NavbarBrand>
               <Link
                  className="flex items-center gap-3"
                  href="/#landing"
               >
                  <p className="hidden font-bold lg:block">FILE BUDDY</p>
               </Link>
            </NavbarBrand>
         </NavbarContent>
         <NavbarContent
            className="hidden gap-7 md:flex"
            justify="center"
         >
            {menu.map((item, index: number) =>
               isLoaded ? (
                  <NavbarItem key={`${item.label}-${index}`}>
                     <Link
                        className="text-sm font-normal"
                        href={item.href}
                     >
                        {item.label}
                     </Link>
                  </NavbarItem>
               ) : (
                  <Skeleton
                     key={`${item.label}-${index}`}
                     className="h-4 w-14 rounded-md"
                  />
               )
            )}
         </NavbarContent>
         <NavbarContent justify="end">
            <NavbarItem className="align-center hidden md:flex">
               {isLoaded ? (
                  <Button
                     as={Link}
                     href="sign-in"
                     className={`rounded-lg font-normal text-white ${isSignedIn && 'hidden'}`}
                     size="sm"
                     data-cy="signin-button"
                     color="primary"
                  >
                     Sign In
                  </Button>
               ) : (
                  <Skeleton className="h-8 w-8 rounded-full" />
               )}
               <div className={isSignedIn ? 'block' : 'hidden'}>
                  <Skeleton
                     className="h-max w-max rounded-full"
                     isLoaded={isLoaded}
                  >
                     <div className="relative h-8 w-8 rounded-full bg-transparent">
                        <div className="absolute left-0 top-0 z-10 opacity-0">
                           <UserButton />
                        </div>
                        <div className="absolute left-0 top-0">
                           <Badge
                              content=""
                              color="success"
                              shape="circle"
                              placement="bottom-right"
                              size="sm"
                           >
                              <Avatar
                                 radius="full"
                                 src={user?.imageUrl}
                                 size="sm"
                              />
                           </Badge>
                        </div>
                     </div>
                  </Skeleton>
               </div>
            </NavbarItem>
            <NavbarMenuToggle
               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
               className="md:hidden"
               icon={
                  isMenuOpen ? (
                     <RxCross2 className="text-2xl text-foreground" />
                  ) : (
                     <RxHamburgerMenu className="text-2xl text-foreground" />
                  )
               }
            />
         </NavbarContent>
         <NavbarMenu className="bg-white">
            {menu.map((item, index) => (
               <Skeleton
                  key={`${item.label}-${index}`}
                  isLoaded={isLoaded}
               >
                  <NavbarMenuItem>
                     <Link
                        className="text-sm font-normal"
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                     >
                        {item.label}
                     </Link>
                  </NavbarMenuItem>
               </Skeleton>
            ))}
            <Button
               as={Link}
               href="sign-in"
               color="primary"
               className={`rounded-lg font-normal text-white ${isSignedIn && 'hidden'}`}
               size="sm"
               data-cy="signin-button"
            >
               Sign In
            </Button>
            <div className={`mt-3 gap-3 ${isSignedIn ? 'flex' : 'hidden'}`}>
               <div className="relative h-8 w-8 rounded-full bg-transparent">
                  <div className="absolute left-0 top-0 z-10 h-full w-full opacity-0">
                     <UserButton />
                  </div>
                  <div className="absolute left-0 top-0 h-full w-full">
                     <Badge
                        content=""
                        color="success"
                        shape="circle"
                        placement="bottom-right"
                        size="sm"
                     >
                        <Avatar
                           radius="full"
                           src={user?.imageUrl}
                           size="sm"
                        />
                     </Badge>
                  </div>
               </div>
               <div className="text-sm leading-none text-black">
                  <p className="font-semibold">{user?.fullName}</p>
                  <p>{user?.emailAddresses[0].emailAddress}</p>
               </div>
            </div>
         </NavbarMenu>
      </Navbar>
   );
}
