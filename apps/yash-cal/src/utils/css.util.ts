import type {CalendarEvent, HourSlot} from "@/types/calendar.type";

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
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height,
        right: rect.right + scrollLeft,
        bottom: rect.bottom + scrollTop,
        x: rect.x + scrollLeft,
        y: rect.y + scrollTop
    };
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

/**
 * Calculates the duration of an event based on the height of the event
 * @param params - The parameters for the calculation
 * @returns The duration of the event
 */
const calculateResizedEventDuration = (params: {
    clientY: number;
    height: number;
    hourSlotConfig: HourSlot;
    startY: number;
    minDuration: number;
    maxDuration: number;
}) => {
    const deltaY = params.clientY - params.startY;
    const newHeight = Math.max(params.height + deltaY, 0); // Prevent negative height

    // Calculate minutes based on height
    const minutesPerPixel = 60 / (params.hourSlotConfig.height as number);
    const durationInMinutes = Math.round(newHeight * minutesPerPixel);

    // Snap to nearest interval
    const interval = params.hourSlotConfig.interval as number;
    const snappedDuration = Math.round(durationInMinutes / interval) * interval;

    // Enforce minimum and maximum duration
    return Math.min(Math.max(snappedDuration, params.minDuration), params.maxDuration);
};

export const CssUtil = {
    calculateTopPosition,
    getElementCoordinates,
    widthAndLeftofEvent,
    height,
    calculateResizedEventDuration
};
