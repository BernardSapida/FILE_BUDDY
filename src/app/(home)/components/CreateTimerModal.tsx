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
   Spinner,
   Switch
} from '@nextui-org/react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useFieldArray, Controller } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';

interface CreateTimerModalProps {
   isOpen: boolean;
   onOpenChange: () => void;
   onClose: () => void;
   timerQuery: any;
}

const CreateTimerModal: FunctionComponent<CreateTimerModalProps> = ({
   isOpen,
   onClose,
   onOpenChange,
   timerQuery
}) => {
   const [loading, setLoading] = useState(false);
   const [goldpass, setGoldpass] = useState(false);
   const {
      register,
      formState: { errors },
      reset,
      control,
      handleSubmit,
      setError,
      clearErrors,
      getValues
   } = useForm<Timer>({
      defaultValues: {
         builders: [
            {
               title: '',
               upgrade_type: 'BUILDING',
               time_duration: { days: 0, hours: 0, minutes: 0 }
            }
         ]
      }
   });
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'builders'
   });
   const timerMutation = trpc.timers.createTimer.useMutation({
      onSuccess: async () => {
         toast.success('Successfully created timer');
         await timerQuery.refetch();

         reset();
         onClose();
         setLoading(false);
      },
      onError: async (data) => {
         toast.error('There was a problem, please try again.');
         setLoading(false);
      }
   });

   const formRef = useRef<HTMLFormElement>(null);

   const onSubmit: SubmitHandler<Timer> = (data) => {
      data.goldpass = goldpass;

      setLoading(true);
      timerMutation.mutate(data);
   };

   const validateTimeDuration = (index: number) => {
      const { days, hours, minutes } = getValues(`builders.${index}.time_duration`);

      if (days == 0 && hours == 0 && minutes == 0) {
         setError(`builders.${index}.time_duration`, {
            type: 'manual',
            message: 'At least one of days, hours, or minutes must be non-zero'
         });

         return false;
      }

      clearErrors(`builders.${index}.time_duration`);
      return true;
   };

   useEffect(() => {
      if (isOpen) reset();
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
                  <ModalHeader className="flex flex-col gap-1">Create new timer</ModalHeader>
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
                        >
                           Goldpass
                        </Switch>
                        {fields.map((field, index) => (
                           <div
                              key={field.id}
                              className="space-y-3 border-1 border-gray p-5 rounded-lg"
                           >
                              <div className="flex justify-between items-center">
                                 <p className="text-sm">Timer {index + 1}</p>
                                 <Button
                                    size="sm"
                                    color="danger"
                                    isIconOnly
                                    onClick={() => remove(index)}
                                 >
                                    <FaRegTrashAlt />
                                 </Button>
                              </div>
                              <Input
                                 type="text"
                                 labelPlacement="inside"
                                 label="Title"
                                 isInvalid={!!errors.builders?.[index]?.title}
                                 variant="faded"
                                 errorMessage={errors.builders?.[index]?.title?.message}
                                 {...register(`builders.${index}.title`, {
                                    required: 'Title is required'
                                 })}
                              />
                              <div className="flex gap-3">
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Days"
                                    variant="faded"
                                    isInvalid={!!errors.builders?.[index]?.time_duration?.days}
                                    errorMessage={
                                       errors.builders?.[index]?.time_duration?.days?.message
                                    }
                                    {...register(`builders.${index}.time_duration.days`, {
                                       required: 'Days is required',
                                       min: {
                                          value: 0,
                                          message: 'Minimum is 0'
                                       },
                                       validate: () => validateTimeDuration(index)
                                    })}
                                 />
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Hours"
                                    variant="faded"
                                    isInvalid={!!errors.builders?.[index]?.time_duration?.hours}
                                    errorMessage={
                                       errors.builders?.[index]?.time_duration?.hours?.message
                                    }
                                    {...register(`builders.${index}.time_duration.hours`, {
                                       required: 'Hours is required',
                                       min: {
                                          value: 0,
                                          message: 'Minimum is 0'
                                       },
                                       max: {
                                          value: 23,
                                          message: 'Maximum is 23'
                                       },
                                       validate: () => validateTimeDuration(index)
                                    })}
                                 />
                                 <Input
                                    type="number"
                                    labelPlacement="inside"
                                    label="Minutes"
                                    variant="faded"
                                    isInvalid={!!errors.builders?.[index]?.time_duration?.minutes}
                                    errorMessage={
                                       errors.builders?.[index]?.time_duration?.minutes?.message
                                    }
                                    {...register(`builders.${index}.time_duration.minutes`, {
                                       required: 'Minutes is required',
                                       min: {
                                          value: 0,
                                          message: 'Minimum is 0'
                                       },
                                       max: {
                                          value: 59,
                                          message: 'Maximum is 59'
                                       },
                                       validate: () => validateTimeDuration(index)
                                    })}
                                 />
                              </div>
                              {errors.builders?.[index]?.time_duration && (
                                 <p className="text-[#D51357] text-xs mt-1">
                                    {errors.builders?.[index]?.time_duration?.message}
                                 </p>
                              )}
                              <Controller
                                 name={`builders.${index}.upgrade_type`}
                                 control={control}
                                 rules={{
                                    required: 'Upgrade type is required'
                                 }}
                                 render={({ field }) => (
                                    <RadioGroup
                                       label="Upgrade type"
                                       orientation="horizontal"
                                       isRequired
                                       isInvalid={!!errors.builders?.[index]?.upgrade_type}
                                       errorMessage={
                                          errors.builders?.[index]?.upgrade_type?.message
                                       }
                                       {...field}
                                    >
                                       <Radio value="BUILDING">Building</Radio>
                                       <Radio value="LABORATORY">Laboratory</Radio>
                                    </RadioGroup>
                                 )}
                              />
                           </div>
                        ))}
                        <Button
                           className="bg-transparent border-2 border-dashed py-5 w-full text-default-400"
                           startContent={<FaPlus />}
                           onPress={() =>
                              append({
                                 title: '',
                                 upgrade_type: 'BUILDING',
                                 time_duration: { days: 0, hours: 0, minutes: 0 }
                              } as Builder)
                           }
                        />
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
                           {loading ? 'Creating...' : 'Create'}
                        </Button>
                     </form>
                  </ModalBody>
               </>
            )}
         </ModalContent>
      </Modal>
   );
};

export default CreateTimerModal;
