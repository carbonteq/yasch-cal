/**
 * Calculates the top position of an event
 * @param eventStart - The start date of the event
 * @param slotHeight - The height of the slot
 * @param distanceFromTop - The distance from the top of the calendar
 * @returns The top position of the event
 */
const calculateTopPosition = (eventStart: Date, slotHeight: number, distanceFromTop: number) => {
    // For the start position, we need to calculate minutes since midnight
    const hours = eventStart.getHours();
    const minutes = eventStart.getMinutes();

    // Total minutes since midnight
    const totalMinutes = hours * 60 + minutes;

    // Convert to pixels (each hour is slotHeight pixels tall)
    const top = distanceFromTop + (totalMinutes / 60) * slotHeight;

    return top;
};

/**
 * Calculates the left position of an event
 * @param eventStart - The start date of the event
 * @param calendarWidth - The width of the calendar
 * @param distanceFromLeft - The distance from the left of the calendar
 * @returns The left position of the event
 */
const calculateLeftPosition = (eventStart: Date, calendarWidth: number, distanceFromLeft: number) => {
    // Default column width - assuming 7 equal columns for days of the week
    // You would need to know the total width of the calendar grid
    // Let's assume each day column has equal width
    const dayColumnWidth = calendarWidth / 7; // For 7 days

    // Determine which day of the week the event is on (0-6)
    const dayOfWeek = eventStart.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate left position based on day of week
    const left = distanceFromLeft + dayOfWeek * dayColumnWidth;

    return left;
};

/**
 * Gets the coordinates of an element
 * @param elementId - The id of the element
 * @returns The coordinates of the element
 */
const getElementCoordinates = (elementId: string) => {
    const element = document.querySelector(elementId) as HTMLElement;

    if (!element) {
        return null;
    }

    const rect = element.getBoundingClientRect();

    return rect;
};

export const CssUtil = {
    calculateTopPosition,
    calculateLeftPosition,
    getElementCoordinates
};
