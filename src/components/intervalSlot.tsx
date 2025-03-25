import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

interface IProps {
    index: number;
    intervalHeight: number;
    start?: Date;
    end?: Date;
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

        const newEvent = {
            ...event,
            start: currentSlotTimeStart,
            end: currentSlotTimeEnd
        };

        ctx.setEvents((prev) => {
            const updatedEvents = prev.map((prevEvent) => (prevEvent.id === event.id ? newEvent : prevEvent));

            return updatedEvents;
        });
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
        />
    );
};
