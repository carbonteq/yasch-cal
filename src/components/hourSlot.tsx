import {useEffect} from "react";

import {Defaults} from "@/constants/default.constant";

import type {HourSlot as HourSlotProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const HourSlot: FC<HourSlotProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setHourSlotConfig({
            height: props.height ?? Defaults.HOUR_SLOT_CONFIG.height,
            interval: props.interval ?? Defaults.HOUR_SLOT_CONFIG.interval
        });
    }, [props.height, props.interval, ctx.setHourSlotConfig]);

    // Calculate number of intervals in the hour
    const intervalCount = 60 / (ctx.hourSlotConfig.interval ?? 60);

    // Generate interval dividers
    const intervalDividers = Array.from({length: intervalCount - 1}, (_, index) => {
        const intervalHeight = (ctx.hourSlotConfig.height ?? 0) / intervalCount;

        return (
            <div
                key={`interval-${index}`}
                className="hour-slot-interval"
                style={{
                    position: "absolute",
                    width: "100%",
                    borderBottom: "1px dashed #e0e0e0",
                    top: `${intervalHeight * (index + 1)}px`
                }}
            />
        );
    });

    return (
        <div
            className="hour-slot"
            style={{
                height: `${ctx.hourSlotConfig.height}px`,
                position: "relative"
            }}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (props.start && props.end) {
                    const timeRange = {start: props.start, end: props.end};

                    if (!props.isSlotSelectAllowed || props.isSlotSelectAllowed(timeRange)) {
                        props.onSlotSelect?.(timeRange);
                    }
                }
            }}>
            {intervalDividers}
        </div>
    );
};
