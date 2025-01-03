export function getFormattedDateTime(date: Date = new Date()) {
   const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
   };

   const formattedDate = date.toLocaleDateString('en-US', options);
   const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
   });

   return `${formattedTime}, ${formattedDate}`;
}
