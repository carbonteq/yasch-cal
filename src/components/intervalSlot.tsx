import type {FC} from "react";

interface IProps {
    index: number;
    intervalHeight: number;
}
export const IntervalSlot: FC<IProps> = (props) => {
    return (
        <div
            key={`interval-${props.index}`}
            className="hour-slot-interval"
            style={{
                width: "100%",
                height: `${props.intervalHeight}px`
            }}
        />
    );
};
