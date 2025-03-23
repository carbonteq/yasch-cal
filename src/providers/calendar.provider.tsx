import {useState} from "react";

import {Defaults} from "@/constants/default.constant";

import type {TimeGrid, WeekHeader, WeekView} from "@/types/calendar.type";
import type {Dispatch, PropsWithChildren, SetStateAction} from "react";

import {CalendarContext} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

interface IProps {}

export interface ICalendarContext {
    weekViewConfig: WeekView;
    setWeekViewConfig: Dispatch<SetStateAction<WeekView>>;

    weekHeaderConfig: WeekHeader;
    setWeekHeaderConfig: Dispatch<SetStateAction<WeekHeader>>;

    selectedWeek: Date[];
    setSelectedWeek: Dispatch<SetStateAction<Date[]>>;

    currentTime: Date;
    setCurrentTime: Dispatch<SetStateAction<Date>>;

    timeGridConfig: Required<TimeGrid>;
    setTimeGridConfig: Dispatch<SetStateAction<Required<TimeGrid>>>;

    timeGridSlots: Date[];
    setTimeGridSlots: Dispatch<SetStateAction<Date[]>>;

    hourSlotConfig: {
        slotHeight: number | string;
    };
    setHourSlotConfig: Dispatch<SetStateAction<{slotHeight: number | string}>>;
}
export const CalendarProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
    const [weekViewConfig, setWeekViewConfig] = useState<WeekView>(Defaults.WEEK_VIEW_CONFIG);

    const [weekHeaderConfig, setWeekHeaderConfig] = useState<WeekHeader>(Defaults.WEEK_HEADER_CONFIG);

    const [selectedWeek, setSelectedWeek] = useState(
        DateUtils.getWeekDates(new Date(), Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek)
    );

    const [currentTime, setCurrentTime] = useState(new Date());

    const [timeGridConfig, setTimeGridConfig] = useState<Required<TimeGrid>>(Defaults.TIME_GRID_CONFIG);

    const [timeGridSlots, setTimeGridSlots] = useState<Date[]>([]);

    const [hourSlotConfig, setHourSlotConfig] = useState(Defaults.HOUR_SLOT_CONFIG);

    return (
        <CalendarContext.Provider
            value={{
                weekViewConfig,
                setWeekViewConfig,
                weekHeaderConfig,
                setWeekHeaderConfig,
                selectedWeek,
                setSelectedWeek,
                currentTime,
                setCurrentTime,
                timeGridConfig,
                setTimeGridConfig,
                timeGridSlots,
                setTimeGridSlots,
                hourSlotConfig,
                setHourSlotConfig
            }}>
            {props.children}
        </CalendarContext.Provider>
    );
};
