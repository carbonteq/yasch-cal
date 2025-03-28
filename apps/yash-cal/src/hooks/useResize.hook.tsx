import type {CalendarEvent} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";

export const useResize = () => {
    const ctx = useCalendarProvider();

    const handleResize = (params: {
        e: React.MouseEvent;
        calendarEvent: CalendarEvent;
        height: number;
        onEventResizeEnd?: (event: CalendarEvent) => void;
    }) => {
        params.e.preventDefault();
        params.e.stopPropagation();

        const isResizeAllowed = ctx.eventItemConfig.isEventResizeAllowed
            ? ctx.eventItemConfig.isEventResizeAllowed(params.calendarEvent)
            : true;

        if (!isResizeAllowed) return;

        const startY = params.e.clientY;
        const startTime = new Date(params.calendarEvent.start);
        const minDuration = ctx.eventConfig.minEventDuration as number;
        const maxDuration = ctx.eventConfig.maxEventDuration as number;

        // Store the event element being resized to ensure we only modify this specific event
        const currentEventElement = document.querySelector<HTMLElement>(`.event-item-${params.calendarEvent.id}`);

        const getNewEndTime = (durationInMinutes: number) => {
            const newEndTime = new Date(startTime);
            newEndTime.setMinutes(startTime.getMinutes() + durationInMinutes);

            return newEndTime;
        };

        const handleMouseMove = (e: MouseEvent) => {
            document.body.style.cursor = "ns-resize";
            const clampedDuration = CssUtil.calculateResizedEventDuration({
                clientY: e.clientY,
                startY,
                height: params.height,
                minDuration,
                maxDuration,
                hourSlotConfig: ctx.hourSlotConfig
            });

            // Calculate the height based on the clamped duration
            const newHeightFromDuration = (clampedDuration / 60) * (ctx.hourSlotConfig.height as number);

            // Update event height temporarily - only for the specific event being resized
            if (currentEventElement) {
                currentEventElement.style.height = `${newHeightFromDuration}px`;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            const clampedDuration = CssUtil.calculateResizedEventDuration({
                clientY: e.clientY,
                startY,
                height: params.height,
                minDuration,
                maxDuration,
                hourSlotConfig: ctx.hourSlotConfig
            });
            const newEndTime = getNewEndTime(clampedDuration);

            // Update the event
            const newEvents = [...ctx.events];
            const eventIndex = newEvents.findIndex((e) => e.id === params.calendarEvent.id);
            if (eventIndex !== -1) {
                const updatedEvent: CalendarEvent = {
                    ...params.calendarEvent,
                    end: newEndTime.toISOString()
                };
                updatedEvent.dateAndTime = ctx.setEventDateTime(updatedEvent);
                newEvents[eventIndex] = updatedEvent;

                ctx.setEvents(newEvents);
                ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(newEvents, ctx.selectedWeek));
                params.onEventResizeEnd?.(updatedEvent);
            }

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return {
        handleResize
    };
};
