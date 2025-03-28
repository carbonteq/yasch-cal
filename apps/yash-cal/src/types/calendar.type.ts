import type {IDateDisplayFormats, ITimeDisplayFormats} from "@/types/date.type";
import type {PropsWithChildren} from "react";

export interface TimeRange {
    start: string; // ISO date string
    end: string; // ISO date string
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarEvent extends TimeRange {
    id: string;
    title: string;
    index?: number;
    meta?: Record<string, unknown>;
    dateAndTime?: {
        start: {
            year: string;
            month: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
        };
        end: {
            year: string;
            month: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
        };
    };
}

export interface ExternalDragEvent extends CalendarEvent {
    draggedElement: HTMLElement;
}

interface Styling {
    className?: string;
    style?: React.CSSProperties;
}

export interface Calendar extends Styling, PropsWithChildren {}

export interface TimeGrid {
    hourRange?: [number, number];
    showCurrentTimeIndicator?: boolean;
    displayFormat?: ITimeDisplayFormats;
}

export interface Toolbar extends Styling, PropsWithChildren {
    onTodayClick?: () => void;
    onNextClick?: () => void;
    onPreviousClick?: () => void;
}

export interface WeekHeader {
    displayFormat?: IDateDisplayFormats;
    render?: (date: string) => React.ReactNode;
}

export interface WeekView extends PropsWithChildren {
    firstDayOfWeek?: WeekDay;
    showWeekends?: boolean;
}

export interface DayView extends PropsWithChildren {
    weekDay?: WeekDay;
}

export interface HourSlot extends Styling {
    start?: string;
    end?: string;
    height?: number;
    interval?: number;
    onSlotSelect?: (slot: TimeRange) => void;
    isSlotSelectAllowed?: (slot: TimeRange) => boolean;
}

export interface Event extends PropsWithChildren {
    minEventDuration?: number;
    maxEventDuration?: number;
    events?: CalendarEvent[];
}

export interface EventItem extends Styling {
    onEventClick?: (event: CalendarEvent) => void;
    onEventDragEnd?: (event: CalendarEvent) => void;
    onEventResizeEnd?: (event: CalendarEvent) => void;

    // validations
    isEventOverlapAllowed?: (existing: CalendarEvent, moving: CalendarEvent) => boolean;
    isEventResizeAllowed?: (event: CalendarEvent) => boolean;
    isEventDragAllowed?: (event: CalendarEvent) => boolean;

    render?: (event: CalendarEvent) => React.ReactNode;
}
