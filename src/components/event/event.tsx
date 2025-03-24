import {useEffect} from "react";

import type {Event as EventProps} from "@/types/calendar.type";
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

                return {
                    id,
                    title,
                    start,
                    end,
                    index,
                    meta: rest
                };
            });

            ctx.setEvents(newEvents);
        }
    }, [props.events, ctx.setEvents]);

    return <div className="event">{props.children}</div>;
};
