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
            title: "E1",
            start: new Date("2025-03-24T00:00:00"),
            end: new Date("2025-03-24T00:15:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "2",
            title: "E2",
            start: new Date("2025-03-25T01:30:00"),
            end: new Date("2025-03-25T03:00:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "3",
            title: "E3",
            start: new Date("2025-03-26T23:00:00"),
            end: new Date("2025-03-26T23:45:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },

        {
            id: "4",
            title: "E4",
            start: new Date("2025-03-24T00:00:00"),
            end: new Date("2025-03-24T00:30:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "5",
            title: "E5",
            start: new Date("2025-03-24T00:00:00"),
            end: new Date("2025-03-24T00:30:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "6",
            title: "E6",
            start: new Date("2025-03-24T00:00:00"),
            end: new Date("2025-03-24T00:30:00"),
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "7",
            title: "E7",
            start: new Date("2025-03-24T00:00:00"),
            end: new Date("2025-03-24T00:30:00"),
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
