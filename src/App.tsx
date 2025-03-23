import {WeekHeader} from "@/components/week/weekHeader";

import {Calendar} from "./components/calendar";
import {DayView} from "./components/dayView";
import {HourSlot} from "./components/hourSlot";
import {TimeGrid} from "./components/timeGrid";
import {Toolbar} from "./components/toolbar";
import {WeekView} from "./components/week/weekView";

export const App = () => {
    return (
        <Calendar>
            <Toolbar />
            <WeekHeader />
            <WeekView firstDayOfWeek={1}>
                <TimeGrid />
                <DayView>
                    <HourSlot />
                </DayView>
            </WeekView>
        </Calendar>
    );
};
