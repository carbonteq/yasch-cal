import {CalendarProvider} from "@/providers/calendar.provider";

import type {Calendar as CalendarProps} from "@/types/calendar.type";
import type {FC} from "react";

export const Calendar: FC<CalendarProps> = (props) => {
    return (
        <CalendarProvider>
            <div className="calendar">{props.children}</div>
        </CalendarProvider>
    );
};
