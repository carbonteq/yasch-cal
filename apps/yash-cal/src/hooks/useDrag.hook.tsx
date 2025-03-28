import type {CalendarEvent} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

export const useDrag = () => {
    const ctx = useCalendarProvider();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>, start: string, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        const event = JSON.parse(e.dataTransfer.getData("event"));

        const currentSlotTimeStart = new Date(start);
        currentSlotTimeStart.setMinutes(
            currentSlotTimeStart.getMinutes() + index * (ctx.hourSlotConfig.interval ?? 60)
        );
        const currentSlotTimeEnd = new Date(currentSlotTimeStart);
        currentSlotTimeEnd.setMinutes(
            currentSlotTimeEnd.getMinutes() +
                DateUtils.getTimeDifferenceInMinutes(new Date(event.start), new Date(event.end))
        );

        // Update the event
        const newEvents = [...ctx.events];
        const toBeUpdatedEvent = newEvents.find((prevEvent) => prevEvent.id === event.id) as CalendarEvent;

        toBeUpdatedEvent.start = currentSlotTimeStart.toISOString();
        toBeUpdatedEvent.end = currentSlotTimeEnd.toISOString();
        toBeUpdatedEvent.dateAndTime = ctx.setEventDateTime(toBeUpdatedEvent);

        ctx.setEvents(newEvents);

        const newSelectedEvents = [...ctx.currentWeekEvents];
        const selectedEventIndex = newSelectedEvents.findIndex((prevEvent) => prevEvent.id === event.id);

        if (selectedEventIndex !== -1) {
            newSelectedEvents[selectedEventIndex] = toBeUpdatedEvent;
        }

        ctx.setCurrentWeekEvents(newSelectedEvents);

        return toBeUpdatedEvent;
    };

    return {handleDrag};
};
