import type {CalendarEvent} from "@/types/calendar.type";

/**
 * Groups events by date and start hour
 * @param events - Array of calendar events
 * @returns Object with events grouped by date and hour
 */
const getGroupedEvents = (events: CalendarEvent[]) => {
    // Create a key function that combines date and hour
    const getGroupKey = (event: CalendarEvent) => {
        const date = event.start.toISOString().split("T")[0]; // YYYY-MM-DD
        const hour = event.start.getHours();

        return `${date}_${hour}`;
    };

    // Use Object.groupBy to group events by date and hour
    const grouped = Object.groupBy(events, getGroupKey);

    // Convert the grouped object to array of arrays for compatibility
    return grouped;
};

export const EventUtils = {
    getGroupedEvents
};
