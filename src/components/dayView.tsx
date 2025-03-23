import React from "react";

import type {DayView as DayViewProps, HourSlot} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

export const DayView: FC<DayViewProps> = (props) => {
    const ctx = useCalendarProvider();

    const currentDate = ctx.selectedWeek[props.weekDay ?? 0];

    return (
        <div className="day-view">
            {ctx.timeGridSlots.map((slot, index) => {
                const startStr = slot.toISOString().split("T")[1] as string;
                const start = new Date(`${(currentDate as Date).toISOString().split("T")[0]}T${startStr}`);
                const end = DateUtils.addMinutes(start, ctx.timeGridConfig.interval);

                return (
                    <div key={index} className="day-view-slot">
                        {React.Children.map(props.children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child as React.ReactElement<HourSlot>, {
                                    start,
                                    end
                                });
                            }

                            return child;
                        })}
                    </div>
                );
            })}
        </div>
    );
};
