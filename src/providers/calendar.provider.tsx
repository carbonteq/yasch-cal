import {useRef, useState} from "react";

import {Defaults} from "@/constants/default.constant";

import type {
    CalendarEvent,
    Event,
    EventItem,
    HourSlot,
    TimeGrid,
    TimeRange,
    WeekHeader,
    WeekView
} from "@/types/calendar.type";
import type {TDateTimeSplit, TIsoDateTimeSplit} from "@/types/date.type";
import type {Dispatch, PropsWithChildren, RefObject, SetStateAction} from "react";

import {CalendarContext} from "@/contexts/calendar.context";
import {DateUtils} from "@/utils/date.util";

interface IProps {}

type dateAndTime = {
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

export interface ICalendarContext {
    resizeRef: RefObject<HTMLDivElement | null>;

    weekViewConfig: WeekView;
    setWeekViewConfig: Dispatch<SetStateAction<WeekView>>;

    weekHeaderConfig: WeekHeader;
    setWeekHeaderConfig: Dispatch<SetStateAction<WeekHeader>>;

    selectedWeek: string[];
    setSelectedWeek: Dispatch<SetStateAction<string[]>>;

    currentTime: Date;
    setCurrentTime: Dispatch<SetStateAction<Date>>;

    timeGridConfig: Required<TimeGrid>;
    setTimeGridConfig: Dispatch<SetStateAction<Required<TimeGrid>>>;

    timeGridSlots: string[];
    setTimeGridSlots: Dispatch<SetStateAction<string[]>>;

    hourSlotConfig: HourSlot;
    setHourSlotConfig: Dispatch<SetStateAction<HourSlot>>;

    eventConfig: Event;
    setEventConfig: Dispatch<SetStateAction<Event>>;

    events: CalendarEvent[];
    setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;

    eventItemConfig: EventItem;
    setEventItemConfig: Dispatch<SetStateAction<EventItem>>;

    currentWeekEvents: CalendarEvent[];
    setCurrentWeekEvents: Dispatch<SetStateAction<CalendarEvent[]>>;

    onIntervalSlotClick: (params: {
        start?: string;
        index: number;
        isSlotSelectAllowed?: (timeRange: TimeRange) => boolean;
        onSlotSelect?: (timeRange: TimeRange) => void;
    }) => void;

    setEventDateTime: (event: CalendarEvent) => dateAndTime;

    filterEventsForCurrentWeek: (events: CalendarEvent[], selectedWeek: string[]) => CalendarEvent[];

    dropHandler: (e: React.DragEvent<HTMLDivElement>, start: string, index: number) => CalendarEvent;

    handleResize: (params: {
        e: React.MouseEvent;
        calendarEvent: CalendarEvent;
        height: number;
        onEventResizeEnd?: (event: CalendarEvent) => void;
    }) => void;
}
export const CalendarProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
    const resizeRef = useRef<HTMLDivElement>(null);

    const [weekViewConfig, setWeekViewConfig] = useState<WeekView>(Defaults.WEEK_VIEW_CONFIG);

    const [weekHeaderConfig, setWeekHeaderConfig] = useState<WeekHeader>(Defaults.WEEK_HEADER_CONFIG);

    const [selectedWeek, setSelectedWeek] = useState<string[]>(
        DateUtils.getWeekDates(new Date(), Defaults.WEEK_VIEW_CONFIG.firstDayOfWeek)
    );

    const [currentTime, setCurrentTime] = useState(new Date());

    const [timeGridConfig, setTimeGridConfig] = useState<Required<TimeGrid>>(Defaults.TIME_GRID_CONFIG);

    const [timeGridSlots, setTimeGridSlots] = useState<string[]>([]);

    const [hourSlotConfig, setHourSlotConfig] = useState<HourSlot>(Defaults.HOUR_SLOT_CONFIG);

    const [eventConfig, setEventConfig] = useState<Event>(Defaults.EVENT_CONFIG);

    const [eventItemConfig, setEventItemConfig] = useState<EventItem>({});

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const [currentWeekEvents, setCurrentWeekEvents] = useState<CalendarEvent[]>([]);

    const setEventDateTime = (event: CalendarEvent) => {
        const [startDate, startTime] = event.start.split("T") as TIsoDateTimeSplit;
        const [startYear, startMonth, startDay] = startDate.split("-") as TDateTimeSplit;
        const [startHour, startMinute, startSecond] = startTime.split(":") as TDateTimeSplit;

        const [endDate, endTime] = event.end.split("T") as TIsoDateTimeSplit;
        const [endYear, endMonth, endDay] = endDate.split("-") as TDateTimeSplit;
        const [endHour, endMinute, endSecond] = endTime.split(":") as TDateTimeSplit;

        return {
            start: {
                year: startYear,
                month: startMonth,
                day: startDay,
                hour: startHour,
                minute: startMinute,
                second: startSecond
            },
            end: {
                year: endYear,
                month: endMonth,
                day: endDay,
                hour: endHour,
                minute: endMinute,
                second: endSecond
            }
        };
    };

    const filterEventsForCurrentWeek = (events: CalendarEvent[], selectedWeek: string[]) => {
        const currentWeekEvents = events.filter((event) => {
            const eventDate = new Date(event.start);

            // Check if the event date falls within the selected week
            return selectedWeek.some((weekDay) => {
                const weekDayDate = new Date(weekDay);

                return (
                    eventDate.getFullYear() === weekDayDate.getFullYear() &&
                    eventDate.getMonth() === weekDayDate.getMonth() &&
                    eventDate.getDate() === weekDayDate.getDate()
                );
            });
        });

        return currentWeekEvents;
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>, start: string, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        const event = JSON.parse(e.dataTransfer.getData("event"));

        const currentSlotTimeStart = new Date(start);
        currentSlotTimeStart.setMinutes(currentSlotTimeStart.getMinutes() + index * (hourSlotConfig.interval ?? 60));
        const currentSlotTimeEnd = new Date(currentSlotTimeStart);
        currentSlotTimeEnd.setMinutes(
            currentSlotTimeEnd.getMinutes() +
                DateUtils.getTimeDifferenceInMinutes(new Date(event.start), new Date(event.end))
        );

        const newEvents = [...events];
        const toBeUpdatedEvent = newEvents.find((prevEvent) => prevEvent.id === event.id) as CalendarEvent;

        toBeUpdatedEvent.start = currentSlotTimeStart.toISOString();
        toBeUpdatedEvent.end = currentSlotTimeEnd.toISOString();
        toBeUpdatedEvent.dateAndTime = setEventDateTime(toBeUpdatedEvent);

        setEvents(newEvents);

        const newSelectedEvents = [...currentWeekEvents];
        const selectedEventIndex = newSelectedEvents.findIndex((prevEvent) => prevEvent.id === event.id);

        if (selectedEventIndex !== -1) {
            newSelectedEvents[selectedEventIndex] = toBeUpdatedEvent;
        }

        setCurrentWeekEvents(newSelectedEvents);

        return toBeUpdatedEvent;
    };

    const onIntervalSlotClick = (params: {
        start?: string;
        index: number;
        isSlotSelectAllowed?: (timeRange: TimeRange) => boolean;
        onSlotSelect?: (timeRange: TimeRange) => void;
    }) => {
        if (params.start) {
            const intervalStart = new Date(params.start);
            intervalStart.setMinutes(intervalStart.getMinutes() + params.index * (hourSlotConfig.interval ?? 60));

            const intervalEnd = new Date(intervalStart);
            intervalEnd.setMinutes(intervalEnd.getMinutes() + (hourSlotConfig.interval ?? 60));

            const timeRange = {start: intervalStart.toISOString(), end: intervalEnd.toISOString()};

            if (!params.isSlotSelectAllowed || params.isSlotSelectAllowed(timeRange)) {
                params.onSlotSelect?.(timeRange);
            }
        }
    };

    const handleResize = (params: {
        e: React.MouseEvent;
        calendarEvent: CalendarEvent;
        height: number;
        onEventResizeEnd?: (event: CalendarEvent) => void;
    }) => {
        const {e, calendarEvent, height, onEventResizeEnd} = params;
        e.preventDefault();
        e.stopPropagation();

        const isResizeAllowed = eventItemConfig.isEventResizeAllowed
            ? eventItemConfig.isEventResizeAllowed(calendarEvent)
            : true;

        if (!isResizeAllowed) return;

        const startY = e.clientY;
        const startTime = new Date(calendarEvent.start);
        const minDuration = eventConfig.minEventDuration as number;
        const maxDuration = eventConfig.maxEventDuration as number;

        // Store the event element being resized to ensure we only modify this specific event
        const currentEventElement = document.querySelector<HTMLElement>(`.event-item-${calendarEvent.id}`);

        const calculateResizedEventDuration = (clientY: number) => {
            const deltaY = clientY - startY;
            const newHeight = Math.max(height + deltaY, 0); // Prevent negative height

            // Calculate minutes based on height
            const minutesPerPixel = 60 / (hourSlotConfig.height as number);
            const durationInMinutes = Math.round(newHeight * minutesPerPixel);

            // Snap to nearest interval
            const interval = hourSlotConfig.interval as number;
            const snappedDuration = Math.round(durationInMinutes / interval) * interval;

            // Enforce minimum and maximum duration
            return Math.min(Math.max(snappedDuration, minDuration), maxDuration);
        };

        const getNewEndTime = (durationInMinutes: number) => {
            const newEndTime = new Date(startTime);
            newEndTime.setMinutes(startTime.getMinutes() + durationInMinutes);

            return newEndTime;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const clampedDuration = calculateResizedEventDuration(e.clientY);

            // Calculate the height based on the clamped duration
            const newHeightFromDuration = (clampedDuration / 60) * (hourSlotConfig.height as number);

            // Update event height temporarily - only for the specific event being resized
            if (currentEventElement) {
                currentEventElement.style.height = `${newHeightFromDuration}px`;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            const clampedDuration = calculateResizedEventDuration(e.clientY);
            const newEndTime = getNewEndTime(clampedDuration);

            // Update the event
            const newEvents = [...events];
            const eventIndex = newEvents.findIndex((e) => e.id === calendarEvent.id);
            if (eventIndex !== -1) {
                const updatedEvent: CalendarEvent = {
                    ...calendarEvent,
                    end: newEndTime.toISOString()
                };
                updatedEvent.dateAndTime = setEventDateTime(updatedEvent);
                newEvents[eventIndex] = updatedEvent;

                setEvents(newEvents);
                setCurrentWeekEvents(filterEventsForCurrentWeek(newEvents, selectedWeek));
                onEventResizeEnd?.(updatedEvent);
            }

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <CalendarContext.Provider
            value={{
                resizeRef,

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
                setHourSlotConfig,

                eventConfig,
                setEventConfig,

                events,
                setEvents,

                eventItemConfig,
                setEventItemConfig,

                currentWeekEvents,
                setCurrentWeekEvents,

                onIntervalSlotClick,

                setEventDateTime,

                filterEventsForCurrentWeek,

                dropHandler,

                handleResize
            }}>
            {props.children}
        </CalendarContext.Provider>
    );
};
