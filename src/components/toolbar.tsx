import "@/styles/toolbar.style.css";

import type {Toolbar as ToolbarProps} from "@/types/calendar.type";
import type {FC} from "react";

import {useCalendarProvider} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

export const Toolbar: FC<ToolbarProps> = (props) => {
    const ctx = useCalendarProvider();

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <button
                    className="toolbar-button-today"
                    onClick={() => {
                        props.onTodayClick?.();
                    }}>
                    Today
                </button>
                <button
                    className="toolbar-button-previous"
                    onClick={() => {
                        const previousWeek = DateUtils.addDays(ctx.selectedWeek[0]!, -1);
                        ctx.setSelectedWeek(DateUtils.getWeekDates(previousWeek, ctx.weekViewConfig.firstDayOfWeek));

                        props.onPreviousClick?.();
                    }}>
                    Previous
                </button>
                <button
                    className="toolbar-button-next"
                    onClick={() => {
                        const nextWeek = DateUtils.addDays(ctx.selectedWeek[6]!, 1);
                        ctx.setSelectedWeek(DateUtils.getWeekDates(nextWeek, ctx.weekViewConfig.firstDayOfWeek));

                        props.onNextClick?.();
                    }}>
                    Next
                </button>
            </div>
            <div className="toolbar-right">{props.children}</div>
        </div>
    );
};
