import moment from 'moment';

/**
 * Formats a date for API submission based on the specified format
 * @param date - The date to format (can be Date, string, or moment object)
 * @param format - The desired output format (e.g., 'DD-MM-YYYY', 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDateForAPI = (date: any, format: string = 'DD-MM-YYYY'): string => {
  if (!date) return '';
  
  try {
    return moment(date).format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Parses a date string and returns a Date object
 * @param dateString - The date string to parse
 * @param format - The format of the input date string
 * @returns Date object or null if parsing fails
 */
export const parseDate = (dateString: string, format?: string): Date | null => {
  if (!dateString) return null;
  
  try {
    const parsed = format ? moment(dateString, format) : moment(dateString);
    return parsed.isValid() ? parsed.toDate() : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Gets the current date in the specified format
 * @param format - The desired output format
 * @returns Formatted current date string
 */
export const getCurrentDate = (format: string = 'DD-MM-YYYY'): string => {
  return moment().format(format);
};

