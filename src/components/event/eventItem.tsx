import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";
import {DateUtils} from "@/utils/date.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    const PADDING_PX = 0;

    const coordinates = ctx.getElementCoordinates(".day-view-container");

    return ctx.events.map((event) => {
        const willTakeMinutes = DateUtils.getTimeDifferenceInMinutes(event.start, event.end);

        const eventHeight =
            (ctx.hourSlotConfig.slotHeight * willTakeMinutes) / 60 - (willTakeMinutes < 60 ? 0 : PADDING_PX);

        const content = props.render ? props.render(event) : <div className="event-item-title">{event.title}</div>;

        return (
            <div
                className="event-item"
                style={{
                    position: "absolute",
                    zIndex: event.index,
                    // width: width,
                    height: eventHeight,
                    top: CssUtil.calculateTopPosition(
                        event.start,
                        ctx.hourSlotConfig.slotHeight,
                        coordinates?.top ?? 0
                    ),
                    left: CssUtil.calculateLeftPosition(event.start, coordinates?.width ?? 0, coordinates?.left ?? 0)
                }}>
                {content}
            </div>
        );
    });
};
