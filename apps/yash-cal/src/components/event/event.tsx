import {useEffect} from "react";

import type {Event as EventProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";

export const Event: FC<EventProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setEventConfig({
            maxEventDuration: props.maxEventDuration ?? ctx.eventConfig.maxEventDuration,
            minEventDuration: props.minEventDuration ?? ctx.eventConfig.minEventDuration
        });
    }, [props.maxEventDuration, props.minEventDuration, ctx.setEventConfig]);

    useEffect(() => {
        if (props.events) {
            const newEvents = props.events
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((event, index) => {
                    const {id, title, start, end, ...rest} = event;

                    return {
                        id,
                        title,
                        start,
                        end,
                        index,
                        meta: rest,
                        dateAndTime: ctx.setEventDateTime(event)
                    };
                });

            ctx.setEvents(newEvents);

            ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(newEvents, ctx.selectedWeek));
        }
    }, [props.events, ctx.setEvents, ctx.setCurrentWeekEvents]);

    return <div className="event">{props.children}</div>;
};
