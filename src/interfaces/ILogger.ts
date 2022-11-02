/* eslint-disable semi */
// NOTE(dylhack): because the semi rule is broken in eslint
export interface ToString {
    toString(): string;
}
export default interface ILogger {
    debug(...messages: string[]): void;
    info(...messages: string[]): void;
    warn(...messages: string[]): void;
    error(message: string, error: ToString): void;
}
