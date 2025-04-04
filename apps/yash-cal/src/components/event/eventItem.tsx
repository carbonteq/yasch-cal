import {useEffect} from "react";

import {useDrag} from "@/hooks/useDrag.hook";
import {useResize} from "@/hooks/useResize.hook";

import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    const {handleResize} = useResize();
    const {handleDragStart} = useDrag();

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

        const isResizeAllowed = ctx.eventItemConfig.isEventResizeAllowed
            ? ctx.eventItemConfig.isEventResizeAllowed(event)
            : true;

        const height = CssUtil.height(event, ctx.hourSlotConfig.height ?? 0);

        return (
            <div
                key={event.id}
                className={`event-item-${event.id}`}
                style={{
                    position: "absolute",
                    zIndex: event.index,
                    width: width,
                    height: height,
                    top: top,
                    left: left
                }}
                onMouseEnter={() => {
                    document.body.style.cursor = "grab";
                }}
                onMouseLeave={() => {
                    document.body.style.cursor = "default";
                }}
                onClick={() => {
                    props.onEventClick?.(event);
                }}
                // draggable={isDragAllowed}
                onMouseDown={(e) => isDragAllowed && handleDragStart(e, event)}
                // onDragStart={(e) => {
                //     e.dataTransfer.setData("event", JSON.stringify(event));
                // }}
            >
                {props.render ? props.render(event) : <div className="event-item-title">{event.title}</div>}
                {isResizeAllowed && (
                    <div
                        className="event-resize-handle"
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "8px",
                            cursor: "ns-resize",
                            backgroundColor: "transparent"
                        }}
                        onMouseDown={(e) =>
                            handleResize({
                                e,
                                calendarEvent: event,
                                height,
                                onEventResizeEnd: props.onEventResizeEnd
                            })
                        }
                    />
                )}
            </div>
        );
    });
};
