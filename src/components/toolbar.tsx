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
                        const newSelectedWeek = DateUtils.getWeekDates(previousWeek, ctx.weekViewConfig.firstDayOfWeek);

                        ctx.setSelectedWeek(newSelectedWeek);

                        ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(ctx.events, newSelectedWeek));

                        props.onPreviousClick?.();
                    }}>
                    Previous
                </button>
                <button
                    className="toolbar-button-next"
                    onClick={() => {
                        const nextWeek = DateUtils.addDays(ctx.selectedWeek[6]!, 1);
                        const newSelectedWeek = DateUtils.getWeekDates(nextWeek, ctx.weekViewConfig.firstDayOfWeek);

                        ctx.setSelectedWeek(newSelectedWeek);

                        ctx.setCurrentWeekEvents(ctx.filterEventsForCurrentWeek(ctx.events, newSelectedWeek));

                        props.onNextClick?.();
                    }}>
                    Next
                </button>
            </div>
            <div className="toolbar-right">{props.children}</div>
        </div>
    );
};
