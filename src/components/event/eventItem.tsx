import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";
import {EventUtils} from "@/utils/event.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    return ctx.events.map((event) => {
        const {width, left} = EventUtils.widthAndLeftofEvent(ctx.events, event);

        return (
            <div
                key={event.id}
                className="event-item"
                style={{
                    position: "absolute",
                    zIndex: event.index,
                    width: width,
                    height: EventUtils.height(event, ctx.hourSlotConfig.slotHeight),
                    top: CssUtil.calculateTopPosition(
                        event.start,
                        ctx.hourSlotConfig.slotHeight,
                        CssUtil.getElementCoordinates(".day-view-container")?.top ?? 0
                    ),
                    left: left
                }}
                onClick={() => {
                    props.onEventClick?.(event);
                }}>
                {props.render ? props.render(event) : <div className="event-item-title">{event.title}</div>}
            </div>
        );
    });
};
