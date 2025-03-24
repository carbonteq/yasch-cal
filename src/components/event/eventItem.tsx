import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";
import {DateUtils} from "@/utils/date.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    const PADDING_PX = 0;

    const content =
        props.render && props.event ? (
            props.render(props.event)
        ) : (
            <>
                <div className="event-item-title">{props.event?.title}</div>
            </>
        );

    const willTakeMinutes = props.event
        ? DateUtils.getTimeDifferenceInMinutes(props.event?.start, props.event?.end)
        : 0;
    const eventHeight =
        (ctx.hourSlotConfig.slotHeight * willTakeMinutes) / 60 - (willTakeMinutes < 60 ? 0 : PADDING_PX);

    const coordinates = ctx.getElementCoordinates(".day-view-container");

    return (
        props.event && (
            <div
                className="event-item"
                style={{
                    position: "absolute",
                    zIndex: props.event?.index,
                    // width: props.width,
                    height: eventHeight,
                    top: CssUtil.calculateTopPosition(
                        props.event?.start,
                        ctx.hourSlotConfig.slotHeight,
                        coordinates?.top ?? 0
                    ),
                    left: CssUtil.calculateLeftPosition(
                        props.event?.start,
                        coordinates?.width ?? 0,
                        coordinates?.left ?? 0
                    )
                }}>
                {content}
            </div>
        )
    );
};
