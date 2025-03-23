import type {CalendarEvent, ExternalDragEvent, TimeRange, UpdatedCalendarEvent, WeekDay} from "./calendar.type";

export interface CalendarContextValue {
    // State
    dateRange: TimeRange;
    activeView: "day" | "week" | "month";
    events: CalendarEvent[];
    currentDate: Date;
    selectedSlot: TimeRange | null;
    selectedEvent: CalendarEvent | null;
    draggedEvent: ExternalDragEvent | null;

    // Handlers
    goToDate: (date: Date) => void;
    goToNext: () => void;
    goToPrevious: () => void;
    changeView: (view: "day" | "week" | "month") => void;
    addEvent: (event: CalendarEvent) => void;
    updateEvent: (event: UpdatedCalendarEvent) => void;
    deleteEvent: (eventId: string) => void;
    selectSlot: (slot: TimeRange) => void;
    selectEvent: (event: CalendarEvent) => void;
    startDrag: (event: ExternalDragEvent) => void;
    handleDrop: (position: {date: Date; time?: string}) => void;

    // Configuration
    hourRange?: [number, number];
    timeInterval?: number;
    firstDayOfWeek?: WeekDay;
    minEventDuration?: number;
    maxEventDuration?: number;
    showWeekends?: boolean;
    readOnly?: boolean;
    slotHeight?: number;
    headerFormats: {
        day?: string;
        week?: string;
        month?: string;
    };

    // Validations
    isSlotSelectAllowed?: (slot: TimeRange) => boolean;
    isEventOverlapAllowed?: (existing: CalendarEvent, moving: CalendarEvent) => boolean;
    isEventResizeAllowed?: (event: CalendarEvent) => boolean;
    isEventDropAllowed?: (event: ExternalDragEvent) => boolean;

    // // Styling
    // className?: string;
    // style?: React.CSSProperties;
}

// <Calendar>
//     <WeekHeader />
//     <TimeGrid />
//     <WeekView>
//         <DayView>
//             <HourSlot />
//         </DayView>
//     </WeekView>
// </Calendar>
