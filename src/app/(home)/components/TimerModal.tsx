import { buildings, upgrades } from '@/config/upgrades';
import { trpc } from '@/lib/trpc/client';
import { getCountdown } from '@/lib/utils';
import {
   Button,
   Input,
   Modal,
   ModalBody,
   ModalContent,
   ModalHeader,
   Radio,
   RadioGroup,
   Select,
   SelectItem,
   Spinner
} from '@nextui-org/react';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiSpeedLine } from 'react-icons/ri';
import { toast } from 'sonner';

interface EditTimerModalProps {
   isOpen: boolean;
   onOpenChange: () => void;
   onClose: () => void;
   builder: Builder;
   timerQuery: any;
   timer: Timer;
}

const TimerModal: FunctionComponent<EditTimerModalProps> = ({
   isOpen,
   onClose,
   onOpenChange,
   builder,
   timerQuery,
   timer
}) => {
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [boostLoading, setBoostLoading] = useState(false);
   const [loading, setLoading] = useState(false);
   const [editMode, setEditMode] = useState(false);
   const [timerInfo, setTimerInfo] = useState<CountdownTimer | null>();
   const resetMutation = trpc.timers.resetBuilderTime.useMutation({
      onSuccess: async () => {
         toast.success('Successfully reset timer');
         await resetState(true);
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
      }
   });
   const startMutation = trpc.timers.startBuilderTime.useMutation({
      onSuccess: async () => {
         toast.success('Successfully started the timer');
         await resetState();
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
      }
   });
   const deleteMutation = trpc.timers.deleteBuilderTime.useMutation({
      onSuccess: async () => {
         toast.success('Successfully deleted the timer');
         await resetState();
         setDeleteLoading(false);
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
         setDeleteLoading(false);
      }
   });
   const boostMutation = trpc.timers.boostApprentice.useMutation({
      onSuccess: async () => {
         toast.success('Successfully apply boost');
         await timerQuery.refetch();
         setBoostLoading(false);
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setDeleteLoading(false);
      }
   });

   const {
      control,
      formState: { errors },
      reset,
      handleSubmit,
      setError,
      clearErrors,
      getValues
   } = useForm<Builder>({
      defaultValues: builder
   });

   const resetTimer = (e: any) => {
      e.preventDefault();

      const data = getValues();

      setLoading(true);
      resetMutation.mutate({ id: data.id, title: data.title });
   };

   const resetState = async (persistModal: boolean = false) => {
      await timerQuery.refetch();
      setLoading(false);
      setEditMode(false);

      if (!persistModal) onClose();
   };

   const onSubmit: SubmitHandler<Builder> = (data) => {
      setLoading(true);
      startMutation.mutate(data);
   };

   const validateTimeDuration = () => {
      const { days, hours, minutes } = getValues(`time_duration`);

      if (days == 0 && hours == 0 && minutes == 0) {
         setError(`time_duration`, {
            type: 'manual',
            message: 'At least one of days, hours, or minutes must be non-zero'
         });

         return false;
      }

      clearErrors(`time_duration`);
      return true;
   };

   const deleteBuilderTimer = () => {
      setDeleteLoading(true);
      deleteMutation.mutate({
         id: builder.id
      });
   };

   const boostApprentice = () => {
      setBoostLoading(true);
      boostMutation.mutate({
         id: builder.id,
         hoursDeduction: timer.builder_apprentice_level
      });
   };

   useEffect(() => {
      if (isOpen && builder) {
         reset(builder);
      }
   }, [isOpen, builder, reset]);

   useEffect(() => {
      const interval = setInterval(() => {
         const data = getCountdown(builder.started_date, builder.time_duration);

         setTimerInfo(() => ({ ...data }));
         setEditMode(data.isDone);
      }, 1000);

      return () => clearInterval(interval);
   }, [builder]);

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
                  <ModalHeader className="flex flex-col gap-1">{timer.name} Timer</ModalHeader>
                  <ModalBody>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                     >
                        <div className="flex justify-between gap-2">
                           <Button
                              size="sm"
                              color="danger"
                              isIconOnly
                              onClick={deleteBuilderTimer}
                              isDisabled={deleteLoading}
                           >
                              {deleteLoading ? (
                                 <Spinner
                                    color="white"
                                    size="sm"
                                 />
                              ) : (
                                 <FaRegTrashAlt />
                              )}
                           </Button>
                           <Button
                              size="sm"
                              color="warning"
                              onClick={boostApprentice}
                              startContent={!boostLoading && <RiSpeedLine className="text-base" />}
                              isDisabled={boostLoading}
                              isLoading={boostLoading}
                              spinner={
                                 <Spinner
                                    size="sm"
                                    color="white"
                                 />
                              }
                           >
                              {boostLoading
                                 ? 'Applying...'
                                 : `-${timer.builder_apprentice_level}hr/s`}
                           </Button>
                        </div>
                        <Controller
                           control={control}
                           name="title"
                           rules={{
                              required: 'Title is required'
                           }}
                           render={({ field }) => (
                              <Select
                                 label="Title"
                                 variant="faded"
                                 isInvalid={!!errors.title}
                                 errorMessage={errors.title?.message}
                                 defaultSelectedKeys={new Set([field.value])}
                                 isDisabled={!editMode}
                                 {...field}
                              >
                                 {upgrades.map((upgrade) => (
                                    <SelectItem
                                       key={upgrade}
                                       value={upgrade}
                                       data-cy="select-truss-type-option"
                                    >
                                       {upgrade}
                                    </SelectItem>
                                 ))}
                              </Select>
                           )}
                        />
                        <div className="flex gap-3">
                           <Controller
                              control={control}
                              name="time_duration.days"
                              rules={{
                                 required: 'Days is required',
                                 min: {
                                    value: 0,
                                    message: 'Minimum is 0'
                                 },
                                 max: {
                                    value: 31,
                                    message: 'Maximum is 31'
                                 },
                                 validate: () => validateTimeDuration()
                              }}
                              render={({ field }) => (
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Days"
                                    isInvalid={!!errors.time_duration?.days}
                                    variant="faded"
                                    errorMessage={errors.time_duration?.days?.message}
                                    disabled={!editMode}
                                    value={`${editMode ? field.value : timerInfo?.remainingDays}`}
                                    onChange={field.onChange}
                                 />
                              )}
                           />
                           <Controller
                              control={control}
                              name="time_duration.hours"
                              rules={{
                                 required: 'Hours is required',
                                 min: {
                                    value: 0,
                                    message: 'Minimum is 0'
                                 },
                                 max: {
                                    value: 23,
                                    message: 'Maximum is 23'
                                 },
                                 validate: () => validateTimeDuration()
                              }}
                              render={({ field }) => (
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Hours"
                                    isInvalid={!!errors.time_duration?.hours}
                                    variant="faded"
                                    errorMessage={errors.time_duration?.hours?.message}
                                    disabled={!editMode}
                                    value={`${editMode ? field.value : timerInfo?.remainingHours}`}
                                    onChange={field.onChange}
                                 />
                              )}
                           />
                           <Controller
                              control={control}
                              name="time_duration.minutes"
                              rules={{
                                 required: 'Minutes is required',
                                 min: {
                                    value: 0,
                                    message: 'Minimum is 0'
                                 },
                                 max: {
                                    value: 59,
                                    message: 'Maximum is 59'
                                 },
                                 validate: () => validateTimeDuration()
                              }}
                              render={({ field }) => (
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Minutes"
                                    isInvalid={!!errors.time_duration?.minutes}
                                    variant="faded"
                                    errorMessage={errors.time_duration?.minutes?.message}
                                    disabled={!editMode}
                                    value={`${editMode ? field.value : timerInfo?.remainingMinutes}`}
                                    onChange={field.onChange}
                                 />
                              )}
                           />
                        </div>
                        {errors.time_duration && (
                           <p className="text-[#D51357] text-xs mt-1">
                              {errors.time_duration?.message}
                           </p>
                        )}
                        <Controller
                           name={`upgrade_type`}
                           control={control}
                           rules={{
                              required: 'Upgrade type is required'
                           }}
                           render={({ field }) => (
                              <RadioGroup
                                 label="Upgrade type"
                                 orientation="horizontal"
                                 isRequired
                                 isInvalid={!!errors.upgrade_type}
                                 errorMessage={errors.upgrade_type?.message}
                                 isDisabled={!editMode}
                                 {...field}
                              >
                                 <Radio value="BUILDING">Building</Radio>
                                 <Radio value="LABORATORY">Laboratory</Radio>
                              </RadioGroup>
                           )}
                        />
                        <div className="flex justify-end">
                           {timerInfo?.isDone || editMode ? (
                              <Button
                                 type="submit"
                                 color="primary"
                                 variant="solid"
                                 isLoading={loading}
                                 spinner={
                                    <Spinner
                                       size="sm"
                                       color="white"
                                    />
                                 }
                              >
                                 {loading ? 'Starting...' : 'Start'}
                              </Button>
                           ) : (
                              <Button
                                 type="button"
                                 variant="solid"
                                 onClick={resetTimer}
                                 isLoading={loading}
                                 spinner={
                                    <Spinner
                                       size="sm"
                                       color="white"
                                    />
                                 }
                              >
                                 {loading ? 'Resetting...' : 'Reset'}
                              </Button>
                           )}
                        </div>
                     </form>
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
};

export default TimerModal;
