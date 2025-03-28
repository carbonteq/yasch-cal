import React, {useEffect} from "react";

import {Defaults} from "@/constants/default.constant";

import type {WeekDay, WeekView as WeekViewProps} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";
import {ReactUtils} from "@/utils/react.utils";

import {DayView} from "../dayView";
import {TimeGrid} from "../timeGrid";

export const WeekView: React.FC<WeekViewProps> = (props) => {
    const ctx = useCalendarProvider();

    const children = React.Children.toArray(props.children);

    const weekArr = Array.from({length: 7}, (_, index) => (index + (ctx.weekViewConfig.firstDayOfWeek ?? 0)) % 7);

    const timeGridChild = children.find((child) => ReactUtils.isReactElement(child) && child.type === TimeGrid);

    const dayViewChildren = children.filter((child) => ReactUtils.isReactElement(child) && child.type === DayView);

    useEffect(() => {
        const firstDayOfWeek = props.firstDayOfWeek ?? Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek;

        ctx.setWeekViewConfig({
            showWeekends: props.showWeekends ?? Defaults.WEEK_VIEW_CONFIG.showWeekends,
            firstDayOfWeek
        });

        ctx.setSelectedWeek(DateUtils.getWeekDates(new Date(), firstDayOfWeek));
    }, [props.firstDayOfWeek, ctx.setWeekViewConfig, ctx.setSelectedWeek]);

    return (
        <div className="week-view" id="week-view" style={{height: "100%", display: "flex", flexDirection: "row"}}>
            {timeGridChild}
            <div
                className="day-view-container"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%"
                }}>
                {weekArr.map((day) => (
                    <div key={day} className="day-view-container-item" style={{flex: 1}}>
                        {ReactUtils.passExtraPropToChildren(dayViewChildren, {weekDay: day as WeekDay})}
                    </div>
                ))}
            </div>
        </div>
    );
};
