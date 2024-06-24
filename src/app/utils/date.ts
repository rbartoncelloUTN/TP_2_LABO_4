import { Timestamp } from "firebase/firestore";

export const getWeekdayDatesNext15Days = (): {
  weekDay: string;
  date: string;
  day: string;
  month: string;
}[] => {
  const dates: { weekDay: string; date: string; day: string; month: string }[] =
    [];
  let currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  while (dates.length !== 15) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();

    // Only include weekdays (Monday to Friday)
    if (dayOfWeek !== 0) {
      dates.push({
        weekDay: currentDate.toLocaleDateString('es-ES', { weekday: 'long' }),
        date: currentDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
        }),
        day: currentDate.getDate().toString(),
        month: currentDate.getMonth().toString(),
      });
    }
  }

  return dates;
};

export const generateHours = (start: number, finish: number): string[] => {
  const hours: string[] = [];
  let hour = new Date();
  hour.setHours(start, 0, 0, 0); // Set initial hour to 8:00 AM

  const finalHour = new Date();
  finalHour.setHours(finish, 0, 0, 0); // Set final hour to 7:00 PM

  while (hour <= finalHour) {
    hours.push(formatHour(hour));
    hour.setMinutes(hour.getMinutes() + 30); // Add 30 minutes
  }

  return hours;
};

const formatHour = (hour: Date): string => {
  const hourString = hour.getHours().toString().padStart(2, '0');
  const minuteString = hour.getMinutes().toString().padStart(2, '0');
  return `${hourString}:${minuteString}`;
};

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
}
