import path from "node:path";
import fs from "node:fs";
import BotFactory from "../providers/BotFactory";
import LoggerFactory from "../providers/LoggerFactory";

export default class ModResolutionService {
    public walk(
        pathLike: fs.PathLike,
        options?:
            | {
                  encoding: BufferEncoding | null;
              }
            | BufferEncoding
            | null
            | undefined
    ): string[] {
        let results: string[] = [];
        const fileList = fs.readdirSync(pathLike, options);
        for (let i = 0; i < fileList.length; i += 1) {
            const file = fileList[i];
            const stat = fs.statSync(path.join(pathLike.toString(), file));
            results = [
                ...results,
                ...(stat && stat.isDirectory()
                    ? this.walk(path.join(pathLike.toString(), file))
                    : [path.join(pathLike.toString(), file)]),
            ];
        }
        return results;
    }

    public async initModules(
        module: string,
        root: string,
        folder: string
    ): Promise<void> {
        const files = this.walk(path.join(root, folder)).filter((file) =>
            [".ts", ".js"].some((ext) => file.endsWith(ext))
        );
        const bot = BotFactory.getBot();
        const logger = LoggerFactory.getLogger(module);
        const tasks: Promise<unknown>[] = [];
        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const task = import(file);
            task.then((mod) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = mod.default;
                if (!result) {
                    logger.error(
                        `File at path ${file} seems to ` +
                            "incorrectly be exporting an event.",
                        null
                    );
                } else {
                    tasks.push(bot.register(result));
                }
            });
            tasks.push(task);
        }

        await Promise.all(tasks).catch((err) =>
            logger.error("init modules failed", err)
        );
    }
}
