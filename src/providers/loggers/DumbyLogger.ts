import ILogger, { ToString } from "../../interfaces/ILogger";

export default class DumbyLogger implements ILogger {
    private readonly module: string;

    constructor(module: string) {
        this.module = module;
    }

    public debug(...messages: string[]): void {
        console.debug(`[${this.module}]`, ...messages);
    }

    public info(...messages: string[]): void {
        console.info(`[${this.module}]`, ...messages);
    }

    public warn(...messages: string[]): void {
        console.warn(`[${this.module}]`, ...messages);
    }

    public error(message: string, error: ToString): void {
        console.error(`[${this.module}]`, message, error);
    }
}
