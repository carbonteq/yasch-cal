import {useDrag} from "@/hooks/useDrag.hook";

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

    const {handleDrag} = useDrag();

    return (
        <div
            key={`interval-${props.index}`}
            className="hour-slot-interval"
            style={{
                width: "100%",
                height: `${props.intervalHeight}px`
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
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("onDragOver", props.start, props.index);
            }}
            onDrop={(e) => {
                const newEvent = handleDrag(e, props.start ?? new Date().toISOString(), props.index);

                newEvent && ctx.eventItemConfig.onEventDragEnd?.(newEvent);
            }}
        />
    );
};
