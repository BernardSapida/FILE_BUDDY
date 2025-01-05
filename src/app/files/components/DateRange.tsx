import { Button, DateInput, Form } from '@nextui-org/react';
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { FaRegCalendar } from 'react-icons/fa6';

interface DateRangeProps {
   setDates: Dispatch<
      SetStateAction<{
         startDate?: Date;
         endDate?: Date;
      }>
   >;
}

const DateRange: FunctionComponent<DateRangeProps> = ({ setDates }) => {
   const onSubmit = (e: any) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.currentTarget)) as {
         startDate: string;
         endDate: string;
      };

      setDates(() => ({
         startDate: data.startDate ? new Date(data.startDate) : undefined,
         endDate: data.endDate ? new Date(data.endDate) : undefined
      }));
   };

   return (
      <Form
         validationBehavior="native"
         onSubmit={onSubmit}
         className="mb-5 flex flex-row items-end gap-2"
      >
         <DateInput
            name="startDate"
            label="Start Date"
            startContent={<FaRegCalendar className="flex-shrink-0 text-default-400" />}
         />
         <DateInput
            name="endDate"
            label="End Date"
            startContent={<FaRegCalendar className="flex-shrink-0 text-default-400" />}
         />
         <Button
            type="submit"
            color="secondary"
         >
            Find
         </Button>
      </Form>
   );
};

export default DateRange;
