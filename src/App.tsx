import "@/styles/main.style.css";

import {WeekHeader} from "@/components/week/weekHeader";

import {Calendar} from "./components/calendar";
import {DayView} from "./components/dayView";
import {Event} from "./components/event/event";
import {EventItem} from "./components/event/eventItem";
import {HourSlot} from "./components/hourSlot";
import {TimeGrid} from "./components/timeGrid";
import {Toolbar} from "./components/toolbar";
import {WeekView} from "./components/week/weekView";

export const App = () => {
    const sampleEvents = [
        {
            id: "1",
            title: "Event 1",
            start: new Date("2025-03-24T00:00:00.000Z"),
            end: new Date("2025-03-24T00:15:00.000Z"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "2",
            title: "Event 2",
            start: new Date("2025-03-25T01:00:00.000Z"),
            end: new Date("2025-03-25T01:30:00.000Z"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "3",
            title: "Event 3",
            start: new Date("2025-03-26T02:00:00.000Z"),
            end: new Date("2025-03-26T02:45:00.000Z"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        }
    ];

    return (
        <Calendar>
            <Toolbar />
            <WeekHeader />
            <WeekView firstDayOfWeek={1}>
                <TimeGrid />
                <DayView>
                    <HourSlot
                        onSlotSelect={(slot) => {
                            console.log("slotTime", slot);
                        }}
                    />
                </DayView>
            </WeekView>
            <Event events={sampleEvents}>
                <EventItem />
            </Event>
        </Calendar>
    );
};
