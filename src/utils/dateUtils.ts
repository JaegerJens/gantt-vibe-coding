// src/utils/dateUtils.ts
import { differenceInDays, addDays, startOfDay } from 'date-fns';

/**
 * Calculates the number of days between two dates (inclusive of start, exclusive of end).
 * Ensures we compare based on the start of the day.
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  return differenceInDays(startOfDay(date2), startOfDay(date1));
};

/**
 * Adds a specified number of days to a date.
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Formats a date for display (e.g., in the header).
 */
export const formatDate = (date: Date, formatStr: string = 'MMM d'): string => {
  // Using basic formatting here, consider `date-fns/format` for more complex needs
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};