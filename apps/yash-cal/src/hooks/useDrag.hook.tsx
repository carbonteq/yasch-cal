import {useRef} from "react";

import type {CalendarEvent} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";
import {DateUtils} from "@/utils/date.util";

export const useDrag = () => {
    const ctx = useCalendarProvider();

    const draggedElementRef = useRef<HTMLElement | null>(null);
    const startYRef = useRef<number | null>(null);
    const startTimeRef = useRef<Date | null>(null);
    const eventRef = useRef<CalendarEvent | null>(null);

    const handleDragStart = (e: React.MouseEvent<HTMLElement, MouseEvent>, event: CalendarEvent) => {
        const draggedElement = e.currentTarget as HTMLElement;
        draggedElementRef.current = draggedElement;

        // Store initial positions and event data
        startYRef.current = e.clientY;
        startTimeRef.current = new Date(event.start);
        eventRef.current = event;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Return early if we don't have all the required refs
        if (!draggedElementRef.current || !startYRef.current || !startTimeRef.current || !eventRef.current) {
            return;
        }

        // Calculate vertical distance moved from start position
        const deltaY = e.clientY - startYRef.current;

        // Calculate height of one interval in pixels
        const intervalHeight = ((ctx.hourSlotConfig.height ?? 0) * (ctx.hourSlotConfig.interval ?? 60)) / 60;

        // Calculate how many intervals we've moved through
        // Round to nearest interval to snap to grid
        const intervals = Math.round(deltaY / intervalHeight);

        if (intervals !== 0) {
            // Create new start time by adding interval offsets
            const newStartTime = new Date(startTimeRef.current);
            newStartTime.setMinutes(newStartTime.getMinutes() + intervals * (ctx.hourSlotConfig.interval ?? 60));

            // Create new end time based on duration
            const eventDuration = DateUtils.getTimeDifferenceInMinutes(
                new Date(eventRef.current.start),
                new Date(eventRef.current.end)
            );
            const newEndTime = new Date(newStartTime);
            newEndTime.setMinutes(newEndTime.getMinutes() + eventDuration);

            // Create updated event with new times
            const updatedEvent: CalendarEvent = {
                ...eventRef.current,
                start: newStartTime.toISOString(),
                end: newEndTime.toISOString()
            };
            updatedEvent.dateAndTime = ctx.setEventDateTime(updatedEvent);

            // Update the draggedElement position
            if (draggedElementRef.current) {
                const newTop = CssUtil.calculateTopPosition(
                    updatedEvent,
                    ctx.hourSlotConfig.height ?? 0,
                    CssUtil.getElementCoordinates(".day-view-container")?.top ?? 0
                );
                draggedElementRef.current.style.top = `${newTop}px`;
            }

            // Store the updated event for next movement calculation
            eventRef.current = updatedEvent;
        }
    };

    const handleMouseUp = () => {
        if (eventRef.current) {
            // Update the events array with the final position
            const newEvents = [...ctx.events];
            const eventIndex = newEvents.findIndex((e) => e.id === eventRef.current!.id);
            if (eventIndex !== -1) {
                newEvents[eventIndex] = eventRef.current;
                ctx.setEvents(newEvents);
                ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(newEvents, ctx.selectedWeek));

                // Notify about drag end through the callback
                ctx.eventItemConfig.onEventDragEnd?.(eventRef.current);
            }
        }

        ctx.eventItemConfig.onEventDragEnd?.(eventRef.current as CalendarEvent);

        // Clean up
        draggedElementRef.current = null;
        startYRef.current = null;
        startTimeRef.current = null;
        eventRef.current = null;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    return {handleDragStart};
};
