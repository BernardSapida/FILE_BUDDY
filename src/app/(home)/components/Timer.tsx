import { getCountdown } from '@/lib/utils';
import { Progress, useDisclosure } from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import TimerModal from './TimerModal';

interface TimerProps {
   builder: Builder;
   timer: Timer;
   timerQuery: any;
}

const Timer: FunctionComponent<TimerProps> = ({ builder, timer, timerQuery }) => {
   const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
   const [progress, setProgress] = useState(0);
   const [time, setTime] = useState('');

   const getProgressColor = () => {
      if (progress < 25) return 'bg-red-500';
      else if (progress < 50) return 'bg-rose-500';
      else if (progress < 75) return 'bg-orange-500';
      else if (progress < 100) return 'bg-yellow-500';
      else return 'bg-green-500';
   };

   useEffect(() => {
      const interval = setInterval(() => {
         const { time, progress } = getCountdown(builder.started_date, builder.time_duration);
         setProgress(progress);
         setTime(time);
      }, 1000);

      return () => clearInterval(interval);
   }, [builder]);

   return (
      <>
         <div
            className="space-y-2 cursor-pointer p-1"
            onClick={onOpen}
         >
            <Progress
               aria-label="Progress"
               size="sm"
               value={progress}
               className="max-w-md"
               classNames={{
                  base: 'max-w-md',
                  track: 'drop-shadow-md',
                  indicator: getProgressColor(),
                  label: 'tracking-wider font-semibold text-default-500 text-tiny',
                  value: 'text-default-500 text-tiny'
               }}
               label={builder.title}
               showValueLabel
            />
            {time != 'Done' && <p className="text-tiny text-right text-default-500">{time}</p>}
         </div>
         <TimerModal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            builder={builder}
            timer={timer}
            timerQuery={timerQuery}
         />
      </>
   );
};

export default Timer;
