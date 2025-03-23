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
            style={{height: ctx.hourSlotConfig.slotHeight}}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onSlotSelect?.({
                    start: new Date(),
                    end: new Date()
                });
            }}>
            <div className="hour-slot-content">asdsadsad</div>
        </div>
    );
};
