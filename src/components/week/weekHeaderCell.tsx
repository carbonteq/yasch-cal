import "@/styles/week.style.css";

import {useCalendarProvider} from "@/contexts/calendar.context";

interface WeekHeaderCellProps {
    date: Date;
}

export const WeekHeaderCell: React.FC<WeekHeaderCellProps> = (props) => {
    const ctx = useCalendarProvider();

    const weekday = props.date.toLocaleDateString("en-US", {
        weekday: ctx.weekHeaderConfig.displayFormat?.weekday
    });

    const date = props.date.toLocaleDateString("en-US", {
        month: ctx.weekHeaderConfig.displayFormat?.month,
        day: ctx.weekHeaderConfig.displayFormat?.day
    });

    const content = ctx.weekHeaderConfig.render ? (
        ctx.weekHeaderConfig.render(props.date)
    ) : (
        <>
            <div className="week-header-cell-day">{weekday}</div>
            <div className="week-header-cell-date">{date}</div>
        </>
    );

    return <div className="week-header-cell">{content}</div>;
};
