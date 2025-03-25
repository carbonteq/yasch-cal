import {useEffect} from "react";

import type {Event as EventProps} from "@/types/calendar.type";
import type {TDateTimeSplit, TIsoDateTimeSplit} from "@/types/date.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const Event: FC<EventProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setEventConfig({
            maxEventDuration: props.maxEventDuration ?? ctx.eventConfig.maxEventDuration,
            minEventDuration: props.minEventDuration ?? ctx.eventConfig.minEventDuration,
            events: props.events ?? ctx.eventConfig.events
        });
    }, [props.events, props.maxEventDuration, props.minEventDuration, ctx.setEventConfig]);

    useEffect(() => {
        if (props.events) {
            const newEvents = props.events.map((event, index) => {
                const {id, title, start, end, ...rest} = event;

                const [startDate, startTime] = start.split("T") as TIsoDateTimeSplit;
                const [startYear, startMonth, startDay] = startDate.split("-") as TDateTimeSplit;
                const [startHour, startMinute, startSecond] = startTime.split(":") as TDateTimeSplit;

                const [endDate, endTime] = end.split("T") as TIsoDateTimeSplit;
                const [endYear, endMonth, endDay] = endDate.split("-") as TDateTimeSplit;
                const [endHour, endMinute, endSecond] = endTime.split(":") as TDateTimeSplit;

                return {
                    id,
                    title,
                    start,
                    end,
                    index,
                    meta: rest,
                    dateAndTime: {
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
                    }
                };
            });

            ctx.setEvents(newEvents);
        }
    }, [props.events, ctx.setEvents, ctx.setCurrentWeekEvents]);

    return <div className="event">{props.children}</div>;
};
