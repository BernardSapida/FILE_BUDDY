import BaseContainer from '@/components/BaseContainer';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';

function Loading() {
   return (
      <BaseContainer styles="h-[calc(100vh-80px)] flex flex-col justify-center">
         <div className="mx-auto max-w-3xl space-y-2 text-center">
            <div className="relative mx-auto h-max w-max rounded-full">
               <div className="absolute left-1/2 top-1/2 z-10 flex h-[93%] w-[93%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-white p-3">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-default-500">
                     <FiLogIn className="text-black" />
                  </div>
               </div>
               <AiOutlineLoading3Quarters className="text-trussen-primary animate-spin text-6xl" />
            </div>
            <h3 className="text-center text-xl font-semibold sm:text-2xl">
               Setting up your account
            </h3>
            <p className="text-center text-sm sm:text-base">
               Please hold on while we redirect you to the new page
            </p>
         </div>
      </BaseContainer>
   );
}

export default Loading;
