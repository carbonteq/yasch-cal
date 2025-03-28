import {useState} from "react";

import type {dateAndTime} from "@/providers/calendar.provider";
import type {CalendarEvent, Event, EventItem, HourSlot} from "@/types/calendar.type";

import {CssUtil} from "@/utils/css.util";

export const useResize = (props: {
    eventItemConfig: EventItem;
    eventConfig: Event;
    events: CalendarEvent[];
    currentWeekEvents: CalendarEvent[];
    selectedWeek: string[];
    hourSlotConfig: HourSlot;

    setEvents: (events: CalendarEvent[]) => void;
    setCurrentWeekEvents: (events: CalendarEvent[]) => void;
    filterEventsForCurrentWeek: (events: CalendarEvent[], selectedWeek: string[]) => CalendarEvent[];
    setSelectedWeek: (week: string[]) => void;
    setEventDateTime: (event: CalendarEvent) => dateAndTime;
}) => {
    const [isResizing, setIsResizing] = useState(false);

    const handleResize = (params: {
        e: React.MouseEvent;
        calendarEvent: CalendarEvent;
        height: number;
        onEventResizeEnd?: (event: CalendarEvent) => void;
    }) => {
        params.e.preventDefault();
        params.e.stopPropagation();

        setIsResizing(true);

        const isResizeAllowed = props.eventItemConfig.isEventResizeAllowed
            ? props.eventItemConfig.isEventResizeAllowed(params.calendarEvent)
            : true;

        if (!isResizeAllowed) return;

        const startY = params.e.clientY;
        const startTime = new Date(params.calendarEvent.start);
        const minDuration = props.eventConfig.minEventDuration as number;
        const maxDuration = props.eventConfig.maxEventDuration as number;

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
                hourSlotConfig: props.hourSlotConfig
            });

            // Calculate the height based on the clamped duration
            const newHeightFromDuration = (clampedDuration / 60) * (props.hourSlotConfig.height as number);

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
                hourSlotConfig: props.hourSlotConfig
            });
            const newEndTime = getNewEndTime(clampedDuration);

            // Update the event
            const newEvents = [...props.events];
            const eventIndex = newEvents.findIndex((e) => e.id === params.calendarEvent.id);
            if (eventIndex !== -1) {
                const updatedEvent: CalendarEvent = {
                    ...params.calendarEvent,
                    end: newEndTime.toISOString()
                };
                updatedEvent.dateAndTime = props.setEventDateTime(updatedEvent);
                newEvents[eventIndex] = updatedEvent;

                props.setEvents(newEvents);
                props.setCurrentWeekEvents(props.filterEventsForCurrentWeek(newEvents, props.selectedWeek));
                params.onEventResizeEnd?.(updatedEvent);
            }

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            setIsResizing(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return {
        handleResize,
        setIsResizing,
        isResizing
    };
};
