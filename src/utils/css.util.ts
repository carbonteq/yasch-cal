import type {CalendarEvent} from "@/types/calendar.type";

import {DateUtils} from "./date.util";

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

/**
 * Calculates the top position of an event
 * @param eventStart - The start date of the event
 * @param slotHeight - The height of the slot
 * @param distanceFromTop - The distance from the top of the calendar
 * @returns The top position of the event
 */
const calculateTopPosition = (event: CalendarEvent, slotHeight: number, distanceFromTop: number) => {
    // For the start position, we need to calculate minutes since midnight

    const hours = Number(event.dateAndTime?.start.hour);
    const minutes = Number(event.dateAndTime?.start.minute);

    // Total minutes since midnight
    const totalMinutes = hours * 60 + minutes;

    // Convert to pixels (each hour is slotHeight pixels tall)
    const top = distanceFromTop + (totalMinutes / 60) * slotHeight;

    return top;
};

const widthAndLeftofEvent = (events: CalendarEvent[], event: CalendarEvent) => {
    const eventStart = event.start;
    const eventEnd = event.end;
    const hourSlotCoordinates = CssUtil.getElementCoordinates(".hour-slot");
    const dayViewContainerCoordinates = CssUtil.getElementCoordinates(".day-view-container");

    // Find events that overlap with the current event
    const overlappingEvents = events.filter((e) => e.start < eventEnd && e.end > eventStart);

    // Total number of overlapping events
    const totalOverlaps = overlappingEvents.length;

    // Position index - where this event appears in the group
    const positionIndex = overlappingEvents.findIndex((e) => e.id === event.id);

    // Calculate width based on position + 1 (not total overlaps)
    // First event gets full width, second half width, third 1/3 width, etc.
    const widthInPixels = (hourSlotCoordinates?.width ?? 0) / (positionIndex + 1);
    const width = `${widthInPixels}px`;

    const dayIndex = new Date(eventStart).getDay(); // 0 for Sunday, 1 for Monday, etc.

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
    const willTakeMinutes = DateUtils.getTimeDifferenceInMinutes(new Date(event.start), new Date(event.end));

    return (slotHeight * willTakeMinutes) / 60;
    // - (willTakeMinutes < 60 ? 0 : PADDING_PX);
};

export const CssUtil = {
    calculateTopPosition,
    getElementCoordinates,
    widthAndLeftofEvent,
    height
};
