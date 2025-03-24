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

export const CssUtil = {
    calculateTopPosition,
    calculateLeftPosition
};
