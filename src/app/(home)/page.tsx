'use client';

import { trpc } from '@/lib/trpc/client';
import { Button, Input, useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import CreateTimerModal from './components/CreateTimerModal';
import TimerCard from './components/TimerCard';
import useDebounce from './custom-hooks/use-debounce';

function Home() {
   //  const [loading, setLoading] = useState(true);
   const [searchValue, setSearchValue] = useState('');
   const debouncedValue = useDebounce(searchValue);
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [filteredTimers, setFilteredTimers] = useState<Timer[]>([]);
   const timerQuery = trpc.timers.getTimers.useQuery(undefined, {
      staleTime: Infinity
   });
   const { data: timers, isLoading } = timerQuery;

   // Filter timers based on the debounced search value
   useEffect(() => {
      if (!timers) return;

      const filtered = timers.filter((timer) =>
         timer.name.toLowerCase().includes(debouncedValue.toLowerCase())
      );

      setFilteredTimers(filtered);
   }, [debouncedValue, timers]);

   return (
      <section className="relative">
         <Input
            className="max-w-60 rounded-xl border-1 border-gray-400/20 shadow-sm mb-6"
            placeholder="Search timer"
            startContent={<IoSearch />}
            onChange={(e) => setSearchValue(e.target.value)}
            data-cy="search-input"
         />
         {filteredTimers.length > 0 ? (
            <div className="flex gap-3 flex-wrap">
               {filteredTimers?.map((timer) => (
                  <TimerCard
                     key={timer.id}
                     timer={timer}
                     timerQuery={timerQuery}
                  />
               ))}
            </div>
         ) : (
            <p className="text-center">Please wait...</p>
         )}
         <CreateTimerModal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            timerQuery={timerQuery}
         />
         <Button
            className="fixed bottom-5 right-5 rounded-full"
            onPress={onOpen}
            isIconOnly
         >
            <FaPlus />
         </Button>
      </section>
   );
}

export default Home;
