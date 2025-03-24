import {useEffect} from "react";

import {Defaults} from "@/constants/default.constant";

import type {HourSlot as HourSlotProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const HourSlot: FC<HourSlotProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setHourSlotConfig({
            slotHeight: props.height ?? Defaults.HOUR_SLOT_CONFIG.slotHeight
        });
    }, [props.height, ctx.setHourSlotConfig]);

    return (
        <div
            className="hour-slot"
            style={{height: `${ctx.hourSlotConfig.slotHeight}px`}}
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
