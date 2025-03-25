import {useEffect} from "react";

import {IntervalSlot} from "@/components/intervalSlot";

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
    const intervalDividers = Array.from({length: intervalCount}, (_, index) => {
        const intervalHeight = (ctx.hourSlotConfig.height ?? 0) / intervalCount;

        return (
            <IntervalSlot
                key={`interval-${index}`}
                index={index}
                intervalHeight={intervalHeight}
                start={props.start}
                end={props.end}
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
