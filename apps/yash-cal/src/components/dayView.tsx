import {Defaults} from "@/constants/default.constant";

import type {DayView as DayViewProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";
import {ReactUtils} from "@/utils/react.utils";

export const DayView: FC<DayViewProps> = (props) => {
    const ctx = useCalendarProvider();

    const currentDate = ctx.selectedWeek[props.weekDay ?? 0];

    return (
        <div className="day-view">
            {ctx.timeGridSlots.map((slot, index) => {
                const startStr = slot;
                const start = new Date(`${currentDate}T${startStr}.000Z`);
                const end = DateUtils.addMinutes(start, Defaults.TIME_GRID_INTERVAL);

                return (
                    <div key={index} className="day-view-slot">
                        {ReactUtils.passExtraPropToChildren(props.children, {
                            start: start.toISOString(),
                            end: end.toISOString()
                        })}
                    </div>
                );
            })}
        </div>
    );
};
