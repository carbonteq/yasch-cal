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
            start: "2025-03-23T00:00:00.000Z",
            end: "2025-03-23T00:15:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "2",
            title: "E2",
            start: "2025-03-25T01:30:00.000Z",
            end: "2025-03-25T03:00:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "3",
            title: "E3",
            start: "2025-03-26T23:00:00.000Z",
            end: "2025-03-26T23:45:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },

        {
            id: "4",
            title: "E4",
            start: "2025-03-24T00:00:00.000Z",
            end: "2025-03-24T00:30:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "5",
            title: "E5",
            start: "2025-03-24T00:00:00.000Z",
            end: "2025-03-24T00:30:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "6",
            title: "E6",
            start: "2025-03-24T00:00:00.000Z",
            end: "2025-03-24T00:30:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        },
        {
            id: "7",
            title: "E7",
            start: "2025-03-24T00:00:00.000Z",
            end: "2025-03-24T00:30:00.000Z",
            randomProp1: "randomValue",
            randomProp2: "randomValue2"
        }
    ];

    return (
        <Calendar>
            <Toolbar />
            <WeekHeader />
            <WeekView firstDayOfWeek={0}>
                <TimeGrid />
                <DayView>
                    <HourSlot
                        height={100}
                        interval={15}
                        onSlotSelect={(slot) => {
                            console.log("slotTime", slot);
                        }}
                    />
                </DayView>
            </WeekView>
            <Event events={sampleEvents}>
                <EventItem
                // onEventClick={(event) => {
                //     console.log("event", event.title);
                // }}
                />
            </Event>
        </Calendar>
    );
};
