import dayjs from 'dayjs';

/**
 * Format a date to a given format
 * @param date - The date to format
 * @param format - The format to use
 * @returns The formatted date
 */
export const formatDate = (
  date: string | Date,
  format: string = 'DD/MM/YYYY HH:mm'
) => {
  return dayjs(date).format(format);
};
