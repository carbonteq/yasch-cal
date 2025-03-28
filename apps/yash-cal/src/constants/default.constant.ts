const WEEK_HEADER_DISPLAY_FORMAT = {
    weekday: "short",
    month: "2-digit",
    day: "2-digit"
} as const;

const WEEK_VIEW_CONFIG = {
    firstDayOfWeek: 0,
    showWeekends: true
} as const;

const WEEK_HEADER_CONFIG = {
    displayWeekNumber: false,
    displayFormat: WEEK_HEADER_DISPLAY_FORMAT
} as const;

const TIME_GRID_DISPLAY_FORMAT = {
    hour: "2-digit",
    minute: "2-digit"
} as const;

const TIME_GRID_CONFIG = {
    hourRange: [0, 23] as [number, number],
    showCurrentTimeIndicator: true,
    displayFormat: TIME_GRID_DISPLAY_FORMAT
} as const;

const HOUR_SLOT_CONFIG = {
    height: 48,
    interval: 15
} as const;

const EVENT_CONFIG = {
    minEventDuration: 15,
    maxEventDuration: 1440, // 24 hours,
    events: []
};

const TIME_GRID_INTERVAL = 60;

export const Defaults = {
    WEEK_HEADER_DISPLAY_FORMAT,
    WEEK_VIEW_CONFIG,
    WEEK_HEADER_CONFIG,
    TIME_GRID_CONFIG,
    HOUR_SLOT_CONFIG,
    EVENT_CONFIG,
    TIME_GRID_INTERVAL
};
