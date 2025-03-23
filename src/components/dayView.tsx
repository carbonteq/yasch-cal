import type {DayView as DayViewProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const DayView: FC<DayViewProps> = (props) => {
    const ctx = useCalendarProvider();

    return (
        <div className="day-view">
            {ctx.timeGridSlots.map((_, index) => (
                <div key={index} className="day-view-slot">
                    {props.children}
                </div>
            ))}
        </div>
    );
};
