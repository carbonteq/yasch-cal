import {createContext, useContext} from "react";

import type {ICalendarContext} from "@/providers/calendar.provider";

export const CalendarContext = createContext<ICalendarContext | null>(null);

export const useCalendarProvider = () => {
    const value = useContext(CalendarContext);
    if (!value) {
        throw new Error("useCalendarProvider must be used within a CalendarProvider");
    }

    return value;
};
