import { upgrades } from '@/config/upgrades';
import { trpc } from '@/lib/trpc/client';
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
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EditAddTimerModalProps {
   isOpen: boolean;
   onOpenChange: () => void;
   onClose: () => void;
   timerQuery: any;
   timerId: string;
}

const AddTimerModal: FunctionComponent<EditAddTimerModalProps> = ({
   isOpen,
   onClose,
   onOpenChange,
   timerQuery,
   timerId
}) => {
   const [loading, setLoading] = useState(false);
   const addMutation = trpc.timers.addBuilderTime.useMutation({
      onSuccess: async () => {
         toast.success('Successfully added new timer');
         await timerQuery.refetch();
         setLoading(false);
         onClose();
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
      }
   });

   const {
      control,
      formState: { errors },
      reset,
      getValues,
      setError,
      clearErrors,
      handleSubmit
   } = useForm<Builder>({
      defaultValues: {
         title: '',
         time_duration: {
            days: 0,
            hours: 0,
            minutes: 0
         },
         upgrade_type: 'BUILDING'
      }
   });

   const onSubmit: SubmitHandler<Builder> = (data) => {
      setLoading(true);
      data.id = timerId;
      addMutation.mutate(data);
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

   useEffect(() => {
      if (isOpen) {
         reset();
      }
   }, [isOpen, reset]);

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
                  <ModalHeader className="flex flex-col gap-1">New timer</ModalHeader>
                  <ModalBody>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-3"
                     >
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
                                    value={`${field.value}`}
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
                                    value={`${field.value}`}
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
                                    value={`${field.value}`}
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
                                 {...field}
                              >
                                 <Radio value="BUILDING">Building</Radio>
                                 <Radio value="LABORATORY">Laboratory</Radio>
                              </RadioGroup>
                           )}
                        />
                        <div className="flex justify-end">
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
                              {loading ? 'Adding...' : 'Add timer'}
                           </Button>
                        </div>
                     </form>
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
};

export default AddTimerModal;
