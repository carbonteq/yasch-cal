import {useCalendarProvider} from "@/contexts/calendar.context";

interface WeekHeaderCellProps {
    date: string;
}

export const WeekHeaderCell: React.FC<WeekHeaderCellProps> = (props) => {
    const ctx = useCalendarProvider();

    const date = new Date(`${props.date}T00:00:00.000Z`);

    const weekday = date.toLocaleDateString("en-US", {
        weekday: ctx.weekHeaderConfig.displayFormat?.weekday
    });

    const dateString = date.toLocaleDateString("en-US", {
        month: ctx.weekHeaderConfig.displayFormat?.month,
        day: ctx.weekHeaderConfig.displayFormat?.day
    });

    const content = ctx.weekHeaderConfig.render ? (
        ctx.weekHeaderConfig.render(props.date)
    ) : (
        <>
            <div className="week-header-cell-day">{weekday}</div>
            <div className="week-header-cell-date">{dateString}</div>
        </>
    );

    return <div className="week-header-cell">{content}</div>;
};
