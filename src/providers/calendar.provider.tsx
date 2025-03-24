import {useState} from "react";

import {Defaults} from "@/constants/default.constant";

import type {CalendarEvent, Event, TimeGrid, WeekHeader, WeekView} from "@/types/calendar.type";
import type {Dispatch, PropsWithChildren, SetStateAction} from "react";

import {CalendarContext} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

interface IProps {}

export interface ICalendarContext {
    weekViewConfig: WeekView;
    setWeekViewConfig: Dispatch<SetStateAction<WeekView>>;

    weekHeaderConfig: WeekHeader;
    setWeekHeaderConfig: Dispatch<SetStateAction<WeekHeader>>;

    selectedWeek: Date[];
    setSelectedWeek: Dispatch<SetStateAction<Date[]>>;

    currentTime: Date;
    setCurrentTime: Dispatch<SetStateAction<Date>>;

    timeGridConfig: Required<TimeGrid>;
    setTimeGridConfig: Dispatch<SetStateAction<Required<TimeGrid>>>;

    timeGridSlots: Date[];
    setTimeGridSlots: Dispatch<SetStateAction<Date[]>>;

    hourSlotConfig: {
        slotHeight: number;
    };
    setHourSlotConfig: Dispatch<SetStateAction<{slotHeight: number}>>;

    eventConfig: Event;
    setEventConfig: Dispatch<SetStateAction<Event>>;

    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
}
export const CalendarProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
    const [weekViewConfig, setWeekViewConfig] = useState<WeekView>(Defaults.WEEK_VIEW_CONFIG);

    const [weekHeaderConfig, setWeekHeaderConfig] = useState<WeekHeader>(Defaults.WEEK_HEADER_CONFIG);

    const [selectedWeek, setSelectedWeek] = useState(
        DateUtils.getWeekDates(new Date(), Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek)
    );

    const [currentTime, setCurrentTime] = useState(new Date());

    const [timeGridConfig, setTimeGridConfig] = useState<Required<TimeGrid>>(Defaults.TIME_GRID_CONFIG);

    const [timeGridSlots, setTimeGridSlots] = useState<Date[]>([]);

    const [hourSlotConfig, setHourSlotConfig] = useState(Defaults.HOUR_SLOT_CONFIG);

    const [eventConfig, setEventConfig] = useState<Event>(Defaults.EVENT_CONFIG);

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    return (
        <CalendarContext.Provider
            value={{
                weekViewConfig,
                setWeekViewConfig,

                weekHeaderConfig,
                setWeekHeaderConfig,

                selectedWeek,
                setSelectedWeek,

                currentTime,
                setCurrentTime,

                timeGridConfig,
                setTimeGridConfig,

                timeGridSlots,
                setTimeGridSlots,

                hourSlotConfig,
                setHourSlotConfig,

                eventConfig,
                setEventConfig,

                events,
                setEvents
            }}>
            {props.children}
        </CalendarContext.Provider>
    );
};
