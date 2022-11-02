// eslint-disable-next-line import/no-extraneous-dependencies
import "dotenv/config";
import BotFactory from "./providers/BotFactory";

async function main() {
    await BotFactory.getBot().start();
}

main().catch(console.error);
