import ILogger from "../interfaces/ILogger";
import DumbyLogger from "./loggers/DumbyLogger";
import ServerLogger from "./loggers/ServerLogger";

export default class LoggerFactory {
    public static getLogger(module: string): ILogger {
        return new DumbyLogger(module);
    }

    public static getGuildLogger(module: string, guildId: string): ILogger {
        return new ServerLogger(module, guildId);
    }
}
