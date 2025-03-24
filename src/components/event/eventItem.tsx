import type {CalendarEvent, EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {CssUtil} from "@/utils/css.util";
import {DateUtils} from "@/utils/date.util";

export const EventItem: FC<EventItemProps> = (props) => {
    const ctx = useCalendarProvider();

    const PADDING_PX = 0;

    const dayViewContainerCoordinates = ctx.getElementCoordinates(".day-view-container");
    const hourSlotCoordinates = ctx.getElementCoordinates(".hour-slot");

    const height = (event: CalendarEvent) => {
        const willTakeMinutes = DateUtils.getTimeDifferenceInMinutes(event.start, event.end);

        return (ctx.hourSlotConfig.slotHeight * willTakeMinutes) / 60 - (willTakeMinutes < 60 ? 0 : PADDING_PX);
    };

    return ctx.events.map((event) => {
        // Find events that overlap with the current event
        const overlappingEvents = ctx.events.filter((e) => e.start < event.end && e.end > event.start);

        // Total number of overlapping events
        const totalOverlaps = overlappingEvents.length;

        // Position index - where this event appears in the group
        const positionIndex = overlappingEvents.findIndex((e) => e.id === event.id);

        // Calculate width based on position + 1 (not total overlaps)
        // First event gets full width, second half width, third 1/3 width, etc.
        const widthInPixels = (hourSlotCoordinates?.width ?? 0) / (positionIndex + 1);
        const width = `${widthInPixels}px`;

        const dayIndex = event.start.getDay(); // 0 for Sunday, 1 for Monday, etc.

        // Calculate the base left position for the day column
        const dayColumnWidth = hourSlotCoordinates?.width ?? 0;
        const baseLeft = (dayViewContainerCoordinates?.left ?? 0) + dayIndex * dayColumnWidth;
        console.log("baseLeft", baseLeft);

        // Calculate left position based on position in the group
        const leftPercentage = (positionIndex * 100) / totalOverlaps;
        const left = dayViewContainerCoordinates?.left
            ? baseLeft + (leftPercentage / 100) * (hourSlotCoordinates?.width ?? 0)
            : 0;

        return (
            <div
                key={event.id}
                className="event-item"
                style={{
                    position: "absolute",
                    zIndex: event.index,
                    width: width,
                    height: height(event),
                    top: CssUtil.calculateTopPosition(
                        event.start,
                        ctx.hourSlotConfig.slotHeight,
                        dayViewContainerCoordinates?.top ?? 0
                    ),
                    left: left
                }}>
                {props.render ? props.render(event) : <div className="event-item-title">{event.title}</div>}
            </div>
        );
    });
};
