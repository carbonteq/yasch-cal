import React, {useEffect} from "react";

import type {EventItem as EventItemProps, Event as EventProps} from "@/types/calendar.type";
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
            const newEvents = props.events.map((event) => {
                const {id, title, start, end, ...rest} = event;

                return {
                    id,
                    title,
                    start,
                    end,
                    meta: rest
                };
            });

            ctx.setEvents(newEvents);
        }
    }, [props.events, ctx.setEvents]);

    return (
        <div className="event">
            {ctx.events.map((event) => {
                return (
                    <div key={event.id}>
                        {React.Children.map(props.children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child as React.ReactElement<EventItemProps>, {
                                    event
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
