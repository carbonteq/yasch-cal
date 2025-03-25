import {useEffect} from "react";

import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setEventItemConfig(props);
    }, [props, ctx.setEventItemConfig]);

    return ctx.currentWeekEvents.map((event) => {
        const {width, left} = CssUtil.widthAndLeftofEvent(ctx.events, event);

        const top = CssUtil.calculateTopPosition(
            event,
            ctx.hourSlotConfig.height ?? 0,
            CssUtil.getElementCoordinates(".day-view-container")?.top ?? 0
        );

        const isDragAllowed = ctx.eventItemConfig.isEventDragAllowed
            ? ctx.eventItemConfig.isEventDragAllowed(event)
            : true;

        return (
            <div
                key={event.id}
                className="event-item"
                style={{
                    position: "absolute",
                    zIndex: event.index,
                    width: width,
                    height: CssUtil.height(event, ctx.hourSlotConfig.height ?? 0),
                    top: top,
                    left: left,
                    cursor: isDragAllowed ? "grab" : "default"
                }}
                onClick={() => {
                    props.onEventClick?.(event);
                }}
                draggable={isDragAllowed}
                onDragStart={(e) => {
                    e.dataTransfer.setData("event", JSON.stringify(event));
                }}>
                {props.render ? props.render(event) : <div className="event-item-title">{event.title}</div>}
            </div>
        );
    });
};
