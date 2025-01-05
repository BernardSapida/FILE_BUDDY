'use client';

import { UserContext } from '@/components/UserContextWrapper';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useContext, useEffect } from 'react';
import Loading from './components/Loading';

interface PageProps {}

const Page: FunctionComponent<PageProps> = () => {
   const { setUser } = useContext(UserContext);
   const router = useRouter();
   const registerUser = trpc.user.handleAuth.useMutation({
      onSuccess(data) {
         if (data) {
            setUser(data);
            router.push('/');
         }
      },
      onError(error) {
         router.push('/');
      }
   });

   useEffect(() => {
      registerUser.mutate();
   }, []);

   return <Loading />;
};

export default Page;
