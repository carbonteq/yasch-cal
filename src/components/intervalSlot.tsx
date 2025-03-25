import type {TimeRange} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

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

    return (
        <div
            key={`interval-${props.index}`}
            className="hour-slot-interval"
            style={{
                width: "100%",
                height: `${props.intervalHeight}px`
            }}
            onDragOver={dragoverHandler}
            onDrop={(e) => {
                const newEvent = ctx.dropHandler(e, props.start ?? new Date().toISOString(), props.index);

                e.dataTransfer.setData("event", JSON.stringify(newEvent));
            }}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                ctx.onIntervalSlotClick({
                    start: props.start,
                    index: props.index,
                    isSlotSelectAllowed: props.isSlotSelectAllowed,
                    onSlotSelect: props.onSlotSelect
                });
            }}
        />
    );
};
