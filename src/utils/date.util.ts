import type {CalendarEvent} from "@/types/calendar.type";

/**
 * Formats a date to ISO string (YYYY-MM-DD)
 * @param date - Date to format
 * @returns Formatted date string
 */
const formatToISO = (date: Date) => {
    const isoString = date.toISOString();

    return isoString.split("T")[0] ?? "";
};

/**
 * Formats a date to a string (YYYY-MM-DD HH:MM:SS)
 * @param date - Date to format
 * @returns Formatted date string
 */
const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Adds or subtracts days from a given date
 * @param date - The date to modify
 * @param days - Number of days to add (positive) or subtract (negative)
 * @returns New date with days added/subtracted
 */
const addDays = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    return newDate;
};

const addMinutes = (date: Date, minutes: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);

    return newDate;
};

/**
 * Gets the start and end dates of the week containing the given date
 * @param date - Any date within the target week
 * @param startDay - Day of week to start from (0 = Sunday, 1 = Monday, etc.)
 * @returns Object containing start and end dates of the week
 */
const getWeekRange = (date: Date, startDay: number = 1) => {
    // Create a new date object to avoid mutating the input
    const currentDate = new Date(date);

    // Get the current day of week (0 = Sunday, 1 = Monday, etc.)
    const currentDay = currentDate.getDay();

    // Calculate the difference between current day and start day
    // If current day is less than start day, we need to go back to previous week
    let diff = currentDay - startDay;
    if (diff < 0) {
        diff += 7;
    }

    // Set the date to the start of the week
    currentDate.setDate(currentDate.getDate() - diff);

    // Create end date by adding 6 days to start date
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 6);

    return {
        start: new Date(currentDate),
        end: endDate
    };
};

/**
 * Gets an array of dates between start and end dates (inclusive)
 * @param start - Start date
 * @param end - End date
 * @returns Array of dates
 */
const getDatesInRange = (start: Date, end: Date) => {
    const dates: Date[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

/**
 * Gets an array of dates for the week containing the given date
 * @param date - Any date within the target week
 * @param startDay - Day of week to start from (0 = Sunday, 1 = Monday, etc.)
 * @returns Array of dates for the week
 */
const getWeekDates = (date: Date, startDay: number = 1) => {
    const {start, end} = getWeekRange(date, startDay);

    return getDatesInRange(start, end);
};

/**
 * Gets the difference in minutes between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Difference in minutes
 */
const getTimeDifferenceInMinutes = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();

    return diff / (1000 * 60);
};

export const DateUtils = {
    getWeekRange,
    getDatesInRange,
    getWeekDates,
    formatToISO,
    addDays,
    addMinutes,
    formatDateTime,
    getTimeDifferenceInMinutes
};
