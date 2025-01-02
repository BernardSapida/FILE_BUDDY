import { IoFlask } from 'react-icons/io5';
import { ImHammer2 } from 'react-icons/im';
import {
   Button,
   Card,
   CardBody,
   CardFooter,
   CardHeader,
   Divider,
   Spinner,
   useDisclosure
} from '@nextui-org/react';
import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';
import AddTimerModal from './AddTimerModal';
import EditTimerModal from './EditTimerModal';
import Timer from './Timer';
import TimerDropdown from './TimerDropdown';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';
import { getCountdown } from '@/lib/utils';

interface TimerCardProps {
   timer: Timer;
   timerQuery: any;
}

const TimerCard: FunctionComponent<TimerCardProps> = ({ timer, timerQuery }) => {
   const [builders, setBuilders] = useState<Builder[]>();
   const [builderLoading, setBuilderLoading] = useState(false);
   const [labLoading, setLabLoading] = useState(false);
   const {
      isOpen: isOpenAdd,
      onOpen: onOpenAdd,
      onOpenChange: onOpenChangeAdd,
      onClose: onCloseAdd
   } = useDisclosure();
   const {
      isOpen: isOpenEdit,
      onOpen: onOpenEdit,
      onOpenChange: onOpenChangeEdit,
      onClose: onCloseEdit
   } = useDisclosure();
   const boostMutation = trpc.timers.boostUpgrade.useMutation({
      onSuccess: async () => {
         toast.success('Successfully apply boost');
         await timerQuery.refetch();
         setBuilderLoading(false);
         setLabLoading(false);
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setBuilderLoading(false);
         setLabLoading(false);
      }
   });

   const boostBuilders = () => {
      setBuilderLoading(true);
      boostMutation.mutate({
         id: timer.id,
         upgrade_type: 'BUILDING',
         hoursDeduction: 9
      });
   };

   const boostLaboratory = () => {
      setLabLoading(true);
      boostMutation.mutate({
         id: timer.id,
         upgrade_type: 'LABORATORY',
         hoursDeduction: 23
      });
   };

   const getShadowColor = () => {
      if (timer.league == 'BRONZE') return 'shadow-orange-700/70';
      else if (timer.league == 'SILVER') return 'shadow-slate-600/70';
      else if (timer.league == 'GOLD') return 'shadow-yellow-700/70';
      else if (timer.league == 'CRYSTAL') return 'shadow-indigo-500/70';
      else if (timer.league == 'MASTER') return 'shadow-zinc-500/70';
      else if (timer.league == 'CHAMPION') return 'shadow-red-700/70';
      else if (timer.league == 'TITAN') return 'shadow-yellow-700/70';
      else if (timer.league == 'LEGEND') return 'shadow-purple-800/70';
   };

   const getBorderColor = () => {
      if (timer.league == 'BRONZE') return 'border-orange-600';
      else if (timer.league == 'SILVER') return 'border-slate-400';
      else if (timer.league == 'GOLD') return 'border-yellow-600';
      else if (timer.league == 'CRYSTAL') return 'border-indigo-200';
      else if (timer.league == 'MASTER') return 'border-zinc-500';
      else if (timer.league == 'CHAMPION') return 'border-red-500';
      else if (timer.league == 'TITAN') return 'border-yellow-500';
      else if (timer.league == 'LEGEND') return 'border-purple-500';
   };

   const getHeaderColor = () => {
      if (timer.league == 'BRONZE') return 'from-orange-600 to-orange-400';
      else if (timer.league == 'SILVER') return 'from-slate-700 to-slate-500';
      else if (timer.league == 'GOLD') return 'from-yellow-600 to-yellow-600';
      else if (timer.league == 'CRYSTAL') return 'from-indigo-500 to-indigo-300';
      else if (timer.league == 'MASTER') return 'from-zinc-700 from-30% to-zinc-500';
      else if (timer.league == 'CHAMPION') return 'from-red-700 to-red-400';
      else if (timer.league == 'TITAN') return 'from-yellow-600 to-yellow-300';
      else if (timer.league == 'LEGEND') return 'from-purple-800 to-purple-500';
   };

   useEffect(() => {
      timer.builders = timer.builders.sort((a, b) => {
         const { remainingMilliseconds: remainingMilliseconds1 } = getCountdown(
            a.started_date,
            a.time_duration
         );
         const { remainingMilliseconds: remainingMilliseconds2 } = getCountdown(
            b.started_date,
            b.time_duration
         );

         // Sort by total minutes
         return remainingMilliseconds1 - remainingMilliseconds2;
      });

      setBuilders(timer.builders);
   }, [timer.builders]);

   return (
      <>
         <Card
            isFooterBlurred
            radius="lg"
            className={`w-60 bg-card text-whit border-1 ${getBorderColor()} ${getShadowColor()} shadow-lg`}
         >
            <CardHeader
               className={`flex justify-between items-center bg-gradient-to-r ${getHeaderColor()}`}
            >
               <div className="flex items-center gap-2">
                  <Image
                     src={`/images/${timer.league.toLowerCase()}.png`}
                     className="w-5 h-6"
                     height={500}
                     width={500}
                     alt="League rank"
                  />
                  <h1 className={`text-gold font-semibold`}>{timer.name}</h1>
               </div>
               <div className="flex items-center  gap-1">
                  {timer.goldpass && (
                     <Image
                        src={'/images/goldpass.png'}
                        className="w-5 h-6"
                        height={500}
                        width={500}
                        alt="Goldpass"
                     />
                  )}
                  <TimerDropdown
                     onOpenAdd={onOpenAdd}
                     onOpenEdit={onOpenEdit}
                     timerId={timer.id}
                     timerQuery={timerQuery}
                  />
               </div>
            </CardHeader>
            <CardBody className="space-y-2">
               {builders ? (
                  builders.map((builder, index) => (
                     <div
                        className="space-y-3"
                        key={builder.id}
                     >
                        <Timer
                           builder={builder}
                           timer={timer}
                           timerQuery={timerQuery}
                        />
                        {timer.builders?.length != index + 1 && <Divider />}
                     </div>
                  ))
               ) : (
                  <p className="text-default-500 text-center text-tiny">No timers</p>
               )}
            </CardBody>
            {timer.builders.length > 0 && (
               <CardFooter className="flex gap-2">
                  <Button
                     size="sm"
                     color="primary"
                     className="w-full"
                     onClick={boostBuilders}
                     startContent={<ImHammer2 />}
                     isDisabled={builderLoading}
                     isLoading={builderLoading}
                     spinner={
                        <Spinner
                           size="sm"
                           color="white"
                        />
                     }
                  >
                     {builderLoading ? 'Applying...' : 'Builder'}
                  </Button>
                  <Button
                     size="sm"
                     color="secondary"
                     className="w-full"
                     onClick={boostLaboratory}
                     startContent={<IoFlask />}
                     isDisabled={labLoading}
                     isLoading={labLoading}
                     spinner={
                        <Spinner
                           size="sm"
                           color="white"
                        />
                     }
                  >
                     {labLoading ? 'Applying...' : 'Laboratory'}
                  </Button>
               </CardFooter>
            )}
         </Card>
         <AddTimerModal
            isOpen={isOpenAdd}
            onClose={onCloseAdd}
            onOpenChange={onOpenChangeAdd}
            timerQuery={timerQuery}
            timerId={timer.id}
         />
         <EditTimerModal
            isOpen={isOpenEdit}
            onClose={onCloseEdit}
            onOpenChange={onOpenChangeEdit}
            timer={timer}
            timerQuery={timerQuery}
         />
      </>
   );
};

export default TimerCard;
