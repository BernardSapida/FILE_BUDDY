import { trpc } from '@/lib/trpc/client';
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   Select,
   SelectItem,
   Spinner,
   Switch
} from '@nextui-org/react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EditTimerModalProps {
   isOpen: boolean;
   onOpenChange: () => void;
   onClose: () => void;
   timer: Timer;
   timerQuery: any;
}

const EditTimerModal: FunctionComponent<EditTimerModalProps> = ({
   isOpen,
   onClose,
   onOpenChange,
   timer,
   timerQuery
}) => {
   const [loading, setLoading] = useState(false);
   const [goldpass, setGoldpass] = useState(false);
   const timerMutation = trpc.timers.updateTimerInfo.useMutation({
      onSuccess: () => {
         timerQuery.refetch();
         setLoading(false);
         toast.success('Successfully updated timer information');
         onClose();
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
      }
   });
   const {
      register,
      formState: { errors },
      reset,
      control,
      handleSubmit
   } = useForm<Timer>({
      defaultValues: timer
   });
   const formRef = useRef<HTMLFormElement>(null);

   const onSubmit: SubmitHandler<Timer> = (data) => {
      data.goldpass = goldpass;
      data.id = timer.id;
      setLoading(true);
      timerMutation.mutate(data);
   };

   useEffect(() => {
      if (isOpen && timer) {
         reset(timer);
         setGoldpass(timer?.goldpass);
      }
   }, [isOpen, timer, reset]);

   return (
      <Modal
         isOpen={isOpen}
         onOpenChange={() => {
            onOpenChange();
            reset();
         }}
         scrollBehavior={'inside'}
         placement={'center'}
         size="xl"
      >
         <ModalContent>
            {() => (
               <>
                  <ModalHeader className="flex flex-col gap-1">Information</ModalHeader>
                  <ModalBody>
                     <form
                        ref={formRef}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3 flex flex-col"
                     >
                        {/* name */}
                        <Input
                           type="text"
                           labelPlacement="inside"
                           label="Timer name"
                           variant="faded"
                           isInvalid={!!errors.name}
                           errorMessage={errors.name?.message}
                           {...register('name', { required: 'Timer name is required' })}
                        />
                        <Input
                           type="number"
                           labelPlacement="inside"
                           label="Apprentice level"
                           variant="faded"
                           isInvalid={!!errors.builder_apprentice_level}
                           errorMessage={errors.builder_apprentice_level?.message}
                           {...register('builder_apprentice_level', {
                              required: 'Apprentice level is required',
                              min: {
                                 value: 1,
                                 message: 'Minimum is 1'
                              }
                           })}
                        />
                        <Controller
                           control={control}
                           name="league"
                           rules={{
                              required: 'League is required'
                           }}
                           render={({ field }) => (
                              <Select
                                 label="League"
                                 variant="faded"
                                 isInvalid={!!errors.league}
                                 errorMessage={errors.league?.message}
                                 defaultSelectedKeys={new Set([timer.league])}
                                 {...field}
                              >
                                 <SelectItem
                                    key="BRONZE"
                                    value="BRONZE"
                                    data-cy="select-truss-type-option"
                                 >
                                    Bronze
                                 </SelectItem>
                                 <SelectItem
                                    key="SILVER"
                                    value="SILVER"
                                    data-cy="select-truss-type-option"
                                 >
                                    Silver
                                 </SelectItem>
                                 <SelectItem
                                    key="GOLD"
                                    value="GOLD"
                                    data-cy="select-truss-type-option"
                                 >
                                    Gold
                                 </SelectItem>
                                 <SelectItem
                                    key="CRYSTAL"
                                    value="CRYSTAL"
                                    data-cy="select-truss-type-option"
                                 >
                                    Crystal
                                 </SelectItem>
                                 <SelectItem
                                    key="MASTER"
                                    value="MASTER"
                                    data-cy="select-truss-type-option"
                                 >
                                    Master
                                 </SelectItem>
                                 <SelectItem
                                    key="CHAMPION"
                                    value="CHAMPION"
                                    data-cy="select-truss-type-option"
                                 >
                                    Champion
                                 </SelectItem>
                                 <SelectItem
                                    key="TITAN"
                                    value="TITAN"
                                    data-cy="select-truss-type-option"
                                 >
                                    Titan
                                 </SelectItem>
                                 <SelectItem
                                    key="LEGEND"
                                    value="LEGEND"
                                    data-cy="select-truss-type-option"
                                 >
                                    Legend
                                 </SelectItem>
                              </Select>
                           )}
                        />
                        <Switch
                           size="sm"
                           aria-label="Goldpass"
                           onValueChange={setGoldpass}
                           color="warning"
                           defaultSelected={timer.goldpass}
                        >
                           Goldpass
                        </Switch>
                        <Button
                           type="submit"
                           className="ml-auto bg-teal-700"
                           isLoading={loading}
                           spinner={
                              <Spinner
                                 size="sm"
                                 color="white"
                              />
                           }
                        >
                           {loading ? 'Saving...' : 'Save'}
                        </Button>
                     </form>
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
};

export default EditTimerModal;
