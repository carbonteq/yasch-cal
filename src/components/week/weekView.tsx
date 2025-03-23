import React, {useEffect} from "react";

import {Defaults} from "@/constants/default.constant";

import type {WeekView as WeekViewProps} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {ReactUtils} from "@/utils/react.utils";

import {DayView} from "../dayView";
import {TimeGrid} from "../timeGrid";

export const WeekView: React.FC<WeekViewProps> = (props) => {
    const ctx = useCalendarProvider();

    const children = React.Children.toArray(props.children);

    const weekArr = Array.from({length: 7}, (_, index) => index);

    useEffect(() => {
        ctx.setWeekViewConfig({
            showWeekends: props.showWeekends ?? Defaults.WEEK_VIEW_CONFIG.showWeekends,
            firstDayOfWeek: props.firstDayOfWeek ?? Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek
        });
    }, [props.firstDayOfWeek, ctx.setWeekViewConfig]);

    return (
        <div className="week-view" style={{height: "100%", display: "flex", flexDirection: "row"}}>
            {children.find((child) => ReactUtils.isReactElement(child) && child.type === TimeGrid)}
            <div
                className="day-view-container"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    flexGrow: 1
                }}>
                {weekArr.map((day) => (
                    <div key={day} className="day-view-container-item">
                        {children.find((child) => ReactUtils.isReactElement(child) && child.type === DayView)}
                    </div>
                ))}
            </div>
        </div>
    );
};
