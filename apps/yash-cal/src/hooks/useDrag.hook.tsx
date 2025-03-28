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
    const lastHorizontalMoveRef = useRef<number>(0);

    const handleDragStart = (e: React.MouseEvent<HTMLElement, MouseEvent>, event: CalendarEvent) => {
        const draggedElement = e.currentTarget as HTMLElement;
        draggedElementRef.current = draggedElement;

        // Store initial positions and event data
        startYRef.current = e.clientY;
        startTimeRef.current = new Date(event.start);
        eventRef.current = event;
        lastHorizontalMoveRef.current = Date.now();

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Return early if we don't have all the required refs
        if (!draggedElementRef.current || !startYRef.current || !startTimeRef.current || !eventRef.current) {
            return;
        }

        document.body.style.cursor = "move";

        // Get event box dimensions and position
        const rect = draggedElementRef.current.getBoundingClientRect();
        const horizontalThreshold = rect.width * 0.1; // 20% of width for edge detection

        // Check if cursor is in left or right edge zone
        const isInLeftEdge = e.clientX >= rect.left && e.clientX <= rect.left + horizontalThreshold;
        const isInRightEdge = e.clientX >= rect.right - horizontalThreshold && e.clientX <= rect.right;

        // Handle horizontal movement with cooldown
        const now = Date.now();
        if (now - lastHorizontalMoveRef.current >= 1000) {
            // 1000ms cooldown
            if (isInLeftEdge || isInRightEdge) {
                const currentDate = new Date(eventRef.current.start);
                const newDate = new Date(currentDate);

                if (isInLeftEdge) {
                    newDate.setDate(currentDate.getDate() - 1);
                } else if (isInRightEdge) {
                    newDate.setDate(currentDate.getDate() + 1);
                }

                // Only proceed if the new date is within the current week
                const isInCurrentWeek = ctx.selectedWeek.some((weekDay) => {
                    const weekDayDate = new Date(weekDay);

                    return (
                        weekDayDate.getDate() === newDate.getDate() &&
                        weekDayDate.getMonth() === newDate.getMonth() &&
                        weekDayDate.getFullYear() === newDate.getFullYear()
                    );
                });

                if (isInCurrentWeek) {
                    // Update event dates
                    const timeDiff = newDate.getTime() - currentDate.getTime();
                    const updatedEvent: CalendarEvent = {
                        ...eventRef.current,
                        start: new Date(new Date(eventRef.current.start).getTime() + timeDiff).toISOString(),
                        end: new Date(new Date(eventRef.current.end).getTime() + timeDiff).toISOString()
                    };
                    updatedEvent.dateAndTime = ctx.setEventDateTime(updatedEvent);

                    // Update the events array immediately
                    const newEvents = [...ctx.events];
                    const eventIndex = newEvents.findIndex((e) => e.id === updatedEvent.id);
                    if (eventIndex !== -1) {
                        newEvents[eventIndex] = updatedEvent;
                        ctx.setEvents(newEvents);
                        ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(newEvents, ctx.selectedWeek));
                    }

                    // Update the visual position
                    const {width, left} = CssUtil.widthAndLeftofEvent(newEvents, updatedEvent);
                    if (draggedElementRef.current) {
                        draggedElementRef.current.style.left = `${left}px`;
                        draggedElementRef.current.style.width = width;
                    }

                    eventRef.current = updatedEvent;
                    lastHorizontalMoveRef.current = now;
                }
            }
        }

        // Handle vertical movement
        const deltaY = e.clientY - startYRef.current;
        const intervalHeight = ((ctx.hourSlotConfig.height ?? 0) * (ctx.hourSlotConfig.interval ?? 60)) / 60;
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
        lastHorizontalMoveRef.current = 0;

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "default";
    };

    return {handleDragStart};
};
