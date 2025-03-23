import React, {useEffect} from "react";

import type {WeekHeader as WeekHeaderProps} from "@/types/calendar.type";

import {useCalendarProvider} from "@/contexts/calendar.context";

import {WeekHeaderCell} from "./weekHeaderCell";

import "@/styles/week.style.css";

import {Defaults} from "@/constants/default.constant";

import {DateUtils} from "@/utils/date.util";

export const WeekHeader: React.FC<WeekHeaderProps> = (props) => {
    const ctx = useCalendarProvider();

    useEffect(() => {
        ctx.setWeekHeaderConfig({
            displayFormat: props.displayFormat ?? Defaults.WEEK_HEADER_DISPLAY_FORMAT,
            render: props.render
        });

        ctx.setSelectedWeek(DateUtils.getWeekDates(new Date(), ctx.weekViewConfig.firstDayOfWeek));
    }, [
        props.displayFormat,
        props.render,
        ctx.setWeekHeaderConfig,
        ctx.setSelectedWeek,
        ctx.weekViewConfig.firstDayOfWeek
    ]);

    return (
        <div className="week-header">
            {ctx.selectedWeek.map((date, i) => (
                <WeekHeaderCell key={i} date={date} />
            ))}
        </div>
    );
};
