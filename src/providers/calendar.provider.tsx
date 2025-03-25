import {useState} from "react";

import {Defaults} from "@/constants/default.constant";

import type {CalendarEvent, Event, HourSlot, TimeGrid, WeekHeader, WeekView} from "@/types/calendar.type";
import type {TDateTimeSplit, TIsoDateTimeSplit} from "@/types/date.type";
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

    timeGridSlots: string[];
    setTimeGridSlots: Dispatch<SetStateAction<string[]>>;

    hourSlotConfig: HourSlot;
    setHourSlotConfig: Dispatch<SetStateAction<HourSlot>>;

    eventConfig: Event;
    setEventConfig: Dispatch<SetStateAction<Event>>;

    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;

    currentWeekEvents: CalendarEvent[];
    setCurrentWeekEvents: Dispatch<SetStateAction<CalendarEvent[]>>;

    setEventDateTime: (event: CalendarEvent) => {
        start: {
            year: string;
            month: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
        };
        end: {
            year: string;
            month: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
        };
    };

    filterEventsForCurrentWeek: (events: CalendarEvent[], selectedWeek: Date[]) => CalendarEvent[];
}
export const CalendarProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
    const [weekViewConfig, setWeekViewConfig] = useState<WeekView>(Defaults.WEEK_VIEW_CONFIG);

    const [weekHeaderConfig, setWeekHeaderConfig] = useState<WeekHeader>(Defaults.WEEK_HEADER_CONFIG);

    const [selectedWeek, setSelectedWeek] = useState(
        DateUtils.getWeekDates(new Date(), Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek)
    );

    const [currentTime, setCurrentTime] = useState(new Date());

    const [timeGridConfig, setTimeGridConfig] = useState<Required<TimeGrid>>(Defaults.TIME_GRID_CONFIG);

    const [timeGridSlots, setTimeGridSlots] = useState<string[]>([]);

    const [hourSlotConfig, setHourSlotConfig] = useState<HourSlot>(Defaults.HOUR_SLOT_CONFIG);

    const [eventConfig, setEventConfig] = useState<Event>(Defaults.EVENT_CONFIG);

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [currentWeekEvents, setCurrentWeekEvents] = useState<CalendarEvent[]>([]);

    const setEventDateTime = (event: CalendarEvent) => {
        const [startDate, startTime] = event.start.split("T") as TIsoDateTimeSplit;
        const [startYear, startMonth, startDay] = startDate.split("-") as TDateTimeSplit;
        const [startHour, startMinute, startSecond] = startTime.split(":") as TDateTimeSplit;

        const [endDate, endTime] = event.end.split("T") as TIsoDateTimeSplit;
        const [endYear, endMonth, endDay] = endDate.split("-") as TDateTimeSplit;
        const [endHour, endMinute, endSecond] = endTime.split(":") as TDateTimeSplit;

        return {
            start: {
                year: startYear,
                month: startMonth,
                day: startDay,
                hour: startHour,
                minute: startMinute,
                second: startSecond
            },
            end: {
                year: endYear,
                month: endMonth,
                day: endDay,
                hour: endHour,
                minute: endMinute,
                second: endSecond
            }
        };
    };

    const filterEventsForCurrentWeek = (events: CalendarEvent[], selectedWeek: Date[]) => {
        const currentWeekEvents = events.filter((event) => {
            const eventDate = new Date(event.start);

            // Check if the event date falls within the selected week
            return selectedWeek.some((weekDay) => {
                const weekDayDate = new Date(weekDay);

                return (
                    eventDate.getFullYear() === weekDayDate.getFullYear() &&
                    eventDate.getMonth() === weekDayDate.getMonth() &&
                    eventDate.getDate() === weekDayDate.getDate()
                );
            });
        });

        return currentWeekEvents;
    };

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
                setEvents,

                currentWeekEvents,
                setCurrentWeekEvents,

                setEventDateTime,

                filterEventsForCurrentWeek
            }}>
            {props.children}
        </CalendarContext.Provider>
    );
};
