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

    return (
        <div
            className="hour-slot"
            style={{height: `${ctx.hourSlotConfig.height}px`}}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (props.start && props.end) {
                    const timeRange = {start: props.start, end: props.end};

                    if (!props.isSlotSelectAllowed || props.isSlotSelectAllowed(timeRange)) {
                        props.onSlotSelect?.(timeRange);
                    }
                }
            }}
        />
    );
};
