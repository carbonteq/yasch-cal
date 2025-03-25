export interface IDateDisplayFormats {
    weekday: "long" | "short" | "narrow";
    month: "long" | "short" | "narrow" | "numeric" | "2-digit";
    day: "numeric" | "2-digit";
}

export interface ITimeDisplayFormats {
    hour: "2-digit" | "numeric";
    minute: "2-digit" | "numeric";
}

export type TDateTimeSplit = [string, string, string];

export type TIsoDateTimeSplit = [string, string];
