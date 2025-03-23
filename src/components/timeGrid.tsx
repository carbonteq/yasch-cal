import "@/styles/timegrid.style.css";

import {useEffect} from "react";

import {Defaults} from "@/constants/default.constant";

import type {TimeGrid as TimeGridProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const TimeGrid: FC<TimeGridProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setTimeGridConfig({
            hourRange: props.hourRange ?? Defaults.TIME_GRID_CONFIG.hourRange,
            interval: props.interval ?? Defaults.TIME_GRID_CONFIG.interval,
            showCurrentTimeIndicator:
                props.showCurrentTimeIndicator ?? Defaults.TIME_GRID_CONFIG.showCurrentTimeIndicator,
            displayFormat: props.displayFormat ?? Defaults.TIME_GRID_CONFIG.displayFormat
        });

        ctx.setTimeGridSlots(generateTimeSlots());
    }, [props.displayFormat, ctx.setTimeGridConfig, props.hourRange, props.interval, props.showCurrentTimeIndicator]);

    const generateTimeSlots = () => {
        const slots: Date[] = [];
        const [startHour, endHour] = ctx.timeGridConfig.hourRange;
        const slotCount = ((endHour - startHour + 1) * 60) / ctx.timeGridConfig.interval;

        for (let i = 0; i < slotCount; i++) {
            const hour = Math.floor((i * ctx.timeGridConfig.interval) / 60) + startHour;
            const minutes = (i * ctx.timeGridConfig.interval) % 60;
            const time = new Date();
            time.setHours(hour, minutes, 0, 0);
            slots.push(time);
        }

        return slots;
    };

    return (
        <div className="time-grid">
            <div
                className="time-grid-markers"
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly"
                }}>
                {ctx.timeGridSlots.map((time, index) => (
                    <div key={index} className="time-grid-marker" style={{height: ctx.hourSlotConfig.slotHeight}}>
                        {time.toLocaleTimeString("en-US", {
                            hour: ctx.timeGridConfig.displayFormat.hour,
                            minute: ctx.timeGridConfig.displayFormat.minute
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
