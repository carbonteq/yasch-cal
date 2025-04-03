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

    const dayViewContainerCoordinates = CssUtil.getElementCoordinates(".day-view-container");

    const handleDragStart = (e: React.MouseEvent<HTMLElement, MouseEvent>, event: CalendarEvent) => {
        e.stopPropagation();
        e.preventDefault();
        draggedElementRef.current = e.currentTarget as HTMLElement;

        // Store initial positions and event data
        startYRef.current = e.clientY;
        startTimeRef.current = new Date(event.start);
        eventRef.current = event;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseUp = () => {
        if (eventRef.current) {
            const areStartAndEndSame = DateUtils.areDatesEqual(
                new Date(eventRef.current.start),
                new Date(ctx.events.find((e) => e.id === eventRef.current!.id)?.start ?? "")
            );
            if (!areStartAndEndSame) {
                // Update the events array with the final position
                const filteredEvents = ctx.events.filter((e) => e.id !== eventRef.current!.id);
                filteredEvents.push(eventRef.current!);
                const sortedEvents = filteredEvents
                    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                    .map((e, index) => ({...e, index}));

                const eventIndex = sortedEvents.findIndex((e) => e.id === eventRef.current!.id);
                if (eventIndex !== -1) {
                    sortedEvents[eventIndex] = {...eventRef.current, index: eventIndex};

                    ctx.setEvents(sortedEvents);
                    ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(sortedEvents, ctx.selectedWeek));
                }
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
        document.body.style.cursor = "default";
    };

    const handleMouseMove = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        // Return early if we don't have all the required refs
        if (!draggedElementRef.current || !startYRef.current || !startTimeRef.current || !eventRef.current) {
            return;
        }

        draggedElementRef.current.style.zIndex = "2147483647";
        document.body.style.cursor = "move";

        // Get event box dimensions and position
        const rect = draggedElementRef.current.getBoundingClientRect();

        // Check if cursor has crossed the left or right border
        const hasCrossedLeftBorder = e.clientX < rect.left;
        const hasCrossedRightBorder = e.clientX > rect.right;

        // Handle horizontal movement when borders are crossed
        if (hasCrossedLeftBorder || hasCrossedRightBorder) {
            const currentDate = new Date(eventRef.current.start);
            const newDate = new Date(eventRef.current.start);

            if (hasCrossedLeftBorder) {
                newDate.setDate(currentDate.getDate() - 1);
            } else if (hasCrossedRightBorder) {
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
                const eventDuration = DateUtils.getTimeDifferenceInMinutes(
                    new Date(eventRef.current.start),
                    new Date(eventRef.current.end)
                );
                const newEndTime = new Date(newDate);
                newEndTime.setMinutes(newEndTime.getMinutes() + eventDuration);
                const updatedEvent: CalendarEvent = {
                    ...eventRef.current,
                    start: newDate.toISOString(),
                    end: newEndTime.toISOString()
                };
                updatedEvent.dateAndTime = ctx.setEventDateTime(updatedEvent);

                const newEvents = [...ctx.events];
                const eventIndex = newEvents.findIndex((e) => e.id === eventRef.current!.id);
                if (eventIndex !== -1) {
                    newEvents[eventIndex] = updatedEvent;
                }

                // Update the visual position
                const {width, left} = CssUtil.widthAndLeftofEvent(newEvents, updatedEvent);
                if (draggedElementRef.current) {
                    draggedElementRef.current.style.left = `${left}px`;
                    draggedElementRef.current.style.width = width;
                    draggedElementRef.current.style.zIndex = String(eventRef.current?.index);
                }

                eventRef.current = updatedEvent;
            }

            startYRef.current = e.clientY;
        }

        // Handle vertical movement
        const deltaY = e.clientY - startYRef.current + 5;
        const intervalHeight = ((ctx.hourSlotConfig.height ?? 0) * (ctx.hourSlotConfig.interval ?? 60)) / 60;
        const intervals = Math.round(deltaY / intervalHeight);

        // check if it is in top/bottom boundry
        const isNotMoved = intervals === 0;
        const isAtTop =
            intervals < 0 &&
            draggedElementRef.current?.style.top === `${dayViewContainerCoordinates?.top.toFixed(1)}px`;
        const eventBottom =
            parseFloat(draggedElementRef.current?.style.height ?? "0") +
            parseFloat(draggedElementRef.current?.style.top ?? "0");
        const isAtBottom =
            intervals > 0 && eventBottom <= parseFloat(dayViewContainerCoordinates?.bottom.toFixed(1) ?? "0");

        if (isNotMoved || isAtTop || isAtBottom) {
            return;
        }

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
                dayViewContainerCoordinates?.top ?? 0
            );

            draggedElementRef.current.style.top = `${newTop}px`;
            eventRef.current = updatedEvent;
        }

        draggedElementRef.current.style.zIndex = String(eventRef.current?.index);
    };

    return {handleDragStart};
};
