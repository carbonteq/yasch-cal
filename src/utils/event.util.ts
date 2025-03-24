import type {CalendarEvent} from "@/types/calendar.type";

import {CssUtil} from "./css.util";
import {DateUtils} from "./date.util";

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

const widthAndLeftofEvent = (events: CalendarEvent[], event: CalendarEvent) => {
    const hourSlotCoordinates = CssUtil.getElementCoordinates(".hour-slot");
    const dayViewContainerCoordinates = CssUtil.getElementCoordinates(".day-view-container");

    // Find events that overlap with the current event
    const overlappingEvents = events.filter((e) => e.start < event.end && e.end > event.start);

    // Total number of overlapping events
    const totalOverlaps = overlappingEvents.length;

    // Position index - where this event appears in the group
    const positionIndex = overlappingEvents.findIndex((e) => e.id === event.id);

    // Calculate width based on position + 1 (not total overlaps)
    // First event gets full width, second half width, third 1/3 width, etc.
    const widthInPixels = (hourSlotCoordinates?.width ?? 0) / (positionIndex + 1);
    const width = `${widthInPixels}px`;

    const dayIndex = event.start.getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Calculate the base left position for the day column
    const dayColumnWidth = hourSlotCoordinates?.width ?? 0;
    const baseLeft = (dayViewContainerCoordinates?.left ?? 0) + dayIndex * dayColumnWidth;

    // Calculate left position based on position in the group
    const leftPercentage = (positionIndex * 100) / totalOverlaps;
    const left = dayViewContainerCoordinates?.left
        ? baseLeft + (leftPercentage / 100) * (hourSlotCoordinates?.width ?? 0)
        : 0;

    return {width, left};
};

const height = (event: CalendarEvent, slotHeight: number) => {
    const willTakeMinutes = DateUtils.getTimeDifferenceInMinutes(event.start, event.end);

    return (slotHeight * willTakeMinutes) / 60;
    // - (willTakeMinutes < 60 ? 0 : PADDING_PX);
};
export const EventUtils = {
    getGroupedEvents,
    widthAndLeftofEvent,
    height
};
