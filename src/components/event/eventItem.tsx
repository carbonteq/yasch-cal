import type {EventItem as EventItemProps} from "@/types/calendar.type";
import type {FC} from "react";

export const EventItem: FC<EventItemProps> = (props) => {
    const content =
        props.render && props.event ? (
            props.render(props.event)
        ) : (
            <>
                <div className="event-item-title">{props.event?.title}</div>
            </>
        );

    return (
        <div
            className="event-item"
            style={{
                position: "absolute",
                zIndex: props.index,
                top: props.top,
                left: props.left,
                width: props.width,
                height: props.height
            }}>
            {content}
        </div>
    );
};
