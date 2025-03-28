import type {dateAndTime} from "@/providers/calendar.provider";
import type {CalendarEvent, HourSlot} from "@/types/calendar.type";

import {DateUtils} from "@/utils/date.util";

export const useDrag = (props: {
    events: CalendarEvent[];
    currentWeekEvents: CalendarEvent[];
    setEvents: (events: CalendarEvent[]) => void;
    setCurrentWeekEvents: (events: CalendarEvent[]) => void;
    setEventDateTime: (event: CalendarEvent) => dateAndTime;
    hourSlotConfig: HourSlot;
}) => {
    const handleDrag = (e: React.DragEvent<HTMLDivElement>, start: string, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        const event = JSON.parse(e.dataTransfer.getData("event"));

        const currentSlotTimeStart = new Date(start);
        currentSlotTimeStart.setMinutes(
            currentSlotTimeStart.getMinutes() + index * (props.hourSlotConfig.interval ?? 60)
        );
        const currentSlotTimeEnd = new Date(currentSlotTimeStart);
        currentSlotTimeEnd.setMinutes(
            currentSlotTimeEnd.getMinutes() +
                DateUtils.getTimeDifferenceInMinutes(new Date(event.start), new Date(event.end))
        );

        const newEvents = [...props.events];
        const toBeUpdatedEvent = newEvents.find((prevEvent) => prevEvent.id === event.id) as CalendarEvent;

        toBeUpdatedEvent.start = currentSlotTimeStart.toISOString();
        toBeUpdatedEvent.end = currentSlotTimeEnd.toISOString();
        toBeUpdatedEvent.dateAndTime = props.setEventDateTime(toBeUpdatedEvent);

        props.setEvents(newEvents);

        const newSelectedEvents = [...props.currentWeekEvents];
        const selectedEventIndex = newSelectedEvents.findIndex((prevEvent) => prevEvent.id === event.id);

        if (selectedEventIndex !== -1) {
            newSelectedEvents[selectedEventIndex] = toBeUpdatedEvent;
        }

        props.setCurrentWeekEvents(newSelectedEvents);

        return toBeUpdatedEvent;
    };

    return {handleDrag};
};
