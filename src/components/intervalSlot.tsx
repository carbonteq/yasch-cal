import type {CalendarEvent, TimeRange} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

interface IProps {
    index: number;
    intervalHeight: number;
    start?: string;
    end?: string;
    isSlotSelectAllowed?: (timeRange: TimeRange) => boolean;
    onSlotSelect?: (timeRange: TimeRange) => void;
}
export const IntervalSlot: FC<IProps> = (props) => {
    const ctx = useCalendarProvider();
    const dragoverHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const event = JSON.parse(e.dataTransfer.getData("event"));

        const currentSlotTimeStart = new Date(props.start ?? new Date());
        currentSlotTimeStart.setMinutes(
            currentSlotTimeStart.getMinutes() + props.index * (ctx.hourSlotConfig.interval ?? 60)
        );
        const currentSlotTimeEnd = new Date(currentSlotTimeStart);
        currentSlotTimeEnd.setMinutes(
            currentSlotTimeEnd.getMinutes() +
                DateUtils.getTimeDifferenceInMinutes(new Date(event.start), new Date(event.end))
        );

        const newEvents = [...ctx.events];
        const eventIndex = newEvents.findIndex((prevEvent) => prevEvent.id === event.id);

        if (eventIndex !== -1) {
            const currentEvent = newEvents[eventIndex] as CalendarEvent;

            currentEvent.start = currentSlotTimeStart.toISOString();
            currentEvent.end = currentSlotTimeEnd.toISOString();
            currentEvent.dateAndTime = ctx.setEventDateTime(currentEvent);
        }

        ctx.setEvents(newEvents);

        const newSelectedEvents = [...ctx.currentWeekEvents];
        const selectedEventIndex = newSelectedEvents.findIndex((prevEvent) => prevEvent.id === event.id);

        if (selectedEventIndex !== -1) {
            newSelectedEvents[selectedEventIndex] = newSelectedEvents[selectedEventIndex] as CalendarEvent;

            newSelectedEvents[selectedEventIndex].start = currentSlotTimeStart.toISOString();
            newSelectedEvents[selectedEventIndex].end = currentSlotTimeEnd.toISOString();
            newSelectedEvents[selectedEventIndex].dateAndTime = ctx.setEventDateTime(
                newSelectedEvents[selectedEventIndex]
            );
        }

        ctx.setCurrentWeekEvents(newSelectedEvents);
    };

    return (
        <div
            key={`interval-${props.index}`}
            className="hour-slot-interval"
            style={{
                width: "100%",
                height: `${props.intervalHeight}px`
            }}
            onDragOver={dragoverHandler}
            onDrop={dropHandler}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (props.start) {
                    const intervalStart = new Date(props.start);
                    intervalStart.setMinutes(
                        intervalStart.getMinutes() + props.index * (ctx.hourSlotConfig.interval ?? 60)
                    );

                    const intervalEnd = new Date(intervalStart);
                    intervalEnd.setMinutes(intervalEnd.getMinutes() + (ctx.hourSlotConfig.interval ?? 60));

                    const timeRange = {start: intervalStart.toISOString(), end: intervalEnd.toISOString()};

                    if (!props.isSlotSelectAllowed || props.isSlotSelectAllowed(timeRange)) {
                        props.onSlotSelect?.(timeRange);
                    }
                }
            }}
        />
    );
};
