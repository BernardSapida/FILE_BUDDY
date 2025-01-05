import BaseContainer from '@/components/BaseContainer';

function Page() {
   return (
      <BaseContainer styles="h-[calc(100vh-160px)] grid items-center">
         <div>
            <h1 className="mb-10 text-center text-6xl font-semibold">File Buddy</h1>
            <p className="text-center text-3xl">
               Streamline, Secure, and Simplify Your File Inventory - All in One Place!
            </p>
         </div>
      </BaseContainer>
   );
}

export default Page;
