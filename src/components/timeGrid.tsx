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
            showCurrentTimeIndicator:
                props.showCurrentTimeIndicator ?? Defaults.TIME_GRID_CONFIG.showCurrentTimeIndicator,
            displayFormat: props.displayFormat ?? Defaults.TIME_GRID_CONFIG.displayFormat
        });

        ctx.setTimeGridSlots(generateTimeSlots(Defaults.TIME_GRID_INTERVAL));
    }, [props.displayFormat, ctx.setTimeGridConfig, props.hourRange, props.showCurrentTimeIndicator]);

    const generateTimeSlots = (interval: number = 60) => {
        const slots: string[] = [];
        const [startHour, endHour] = ctx.timeGridConfig.hourRange;
        const slotCount = ((endHour - startHour + 1) * 60) / interval;

        for (let i = 0; i < slotCount; i++) {
            const hour = Math.floor((i * interval) / 60) + startHour;
            const minutes = (i * interval) % 60;

            const formattedHour = hour.toString().padStart(2, "0");
            const formattedMinutes = minutes.toString().padStart(2, "0");

            const timeString = `${formattedHour}:${formattedMinutes}:00`;
            slots.push(timeString);
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
                    <div key={index} className="time-grid-marker" style={{height: ctx.hourSlotConfig.height}}>
                        {(() => {
                            const [hours, minutes] = time.split(":") as [string, string];
                            const hour = Number(hours);
                            const minute = Number(minutes);

                            const date = new Date();
                            date.setHours(hour);
                            date.setMinutes(minute);
                            date.setSeconds(0);

                            return date.toLocaleTimeString([], {
                                hour: ctx.timeGridConfig.displayFormat.hour,
                                minute: ctx.timeGridConfig.displayFormat.minute
                            });
                        })()}
                    </div>
                ))}
            </div>
        </div>
    );
};
