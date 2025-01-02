'use client';

import {
   Dropdown,
   DropdownTrigger,
   Button,
   DropdownMenu,
   DropdownSection,
   DropdownItem
} from '@nextui-org/react';
import { FunctionComponent } from 'react';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';

interface TimerDropdownProps {
   onOpenAdd: () => void;
   onOpenEdit: () => void;
   timerId: string;
   timerQuery: any;
}

const TimerDropdown: FunctionComponent<TimerDropdownProps> = ({
   onOpenAdd,
   onOpenEdit,
   timerId,
   timerQuery
}) => {
   const deleteMutation = trpc.timers.deleteTimer.useMutation({
      onSuccess: async () => {
         toast.success('Successfully deleted timer');
         await timerQuery.refetch();
      }
   });

   const deleteTimer = () => {
      deleteMutation.mutate({
         id: timerId
      });
   };

   return (
      <Dropdown>
         <DropdownTrigger>
            <Button
               size="sm"
               isIconOnly
               className="bg-transparent"
            >
               <BsThreeDotsVertical className="text-lg pointer-events-none flex-shrink-0" />
            </Button>
         </DropdownTrigger>
         <DropdownMenu
            variant="bordered"
            aria-label="Card timer dropdown menu"
         >
            <DropdownSection title="Actions">
               <DropdownItem
                  key={`add-${timerId}`}
                  startContent={
                     <MdAdd className="text-lg text-default-500 pointer-events-none flex-shrink-0" />
                  }
                  onPress={onOpenAdd}
               >
                  Add new timer
               </DropdownItem>
               <DropdownItem
                  key={`edit-${timerId}`}
                  startContent={
                     <MdEdit className="text-lg text-default-500 pointer-events-none flex-shrink-0" />
                  }
                  onPress={onOpenEdit}
               >
                  Edit timer
               </DropdownItem>
               <DropdownItem
                  key={`delete-${timerId}`}
                  className="text-danger"
                  startContent={<MdDelete className="text-lg pointer-events-none flex-shrink-0" />}
                  onClick={deleteTimer}
               >
                  Delete timer
               </DropdownItem>
            </DropdownSection>
         </DropdownMenu>
      </Dropdown>
   );
};

export default TimerDropdown;
