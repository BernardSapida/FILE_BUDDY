export function getCountdown(startedDate: Date, timeDuration: TimeDuration): CountdownTimer {
   // Parse startedDate
   const start = new Date(startedDate);

   // Convert timeDuration values to numbers
   const days = timeDuration.days;
   const hours = timeDuration.hours;
   const minutes = timeDuration.minutes;

   // Add timeDuration to startedDate
   const end = new Date(start);
   end.setDate(end.getDate() + days);
   end.setHours(end.getHours() + hours);
   end.setMinutes(end.getMinutes() + minutes);

   // Calculate the total duration in milliseconds
   const totalDuration = end.getTime() - start.getTime();

   // Calculate the elapsed time
   const now = new Date();
   const elapsedTime = now.getTime() - start.getTime();

   // Calculate the remaining time
   const timeDiff = end.getTime() - now.getTime();

   const progressPercentage = Math.floor((elapsedTime / totalDuration) * 100);

   // Calculate days, hours, minutes
   const remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
   const remainingHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
   const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
   const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

   const D = remainingDays > 0 ? `${remainingDays}d` : '';
   const hh = remainingHours > 0 ? `${remainingHours}h` : '';
   const mm = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
   const ss = remainingSeconds > 0 ? `${remainingSeconds}s` : '';

   // Format as "Day hh:mm:ss"
   return {
      remainingMilliseconds: timeDiff > 0 ? timeDiff : 0,
      remainingDays: remainingDays > 0 ? remainingDays : 0,
      remainingHours: remainingHours > 0 ? remainingHours : 0,
      remainingMinutes: remainingMinutes > 0 ? remainingMinutes : 0,
      time: `${D} ${hh} ${mm} ${ss}`,
      progress: Number(progressPercentage),
      isDone: timeDiff <= 0
   };
}

export function deductHours(
   time: { days: number; hours: number; minutes: number },
   hoursDeduction: number
) {
   let { days, hours, minutes } = time;

   // Subtract hours and calculate new days and hours
   hours -= hoursDeduction;

   // Handle negative hours by subtracting days
   if (hours < 0) {
      const dayReduction = Math.ceil(Math.abs(hours) / 24); // How many days to reduce
      days -= dayReduction;
      hours = (24 + (hours % 24)) % 24; // Correct negative hours to 24-hour format
   }

   // Handle negative days (if hoursDeduction is too large)
   if (days < 0) {
      days = 0;
      hours = 0;
      minutes = 0; // Reset time to zero if days go below zero
   }

   return { days, hours, minutes };
}
