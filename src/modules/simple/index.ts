import IModule from "../../interfaces/IModule";
import ModResolutionService from "../../services/ModResolutionService";

export default class SimpleModule implements IModule {
    private readonly mods: ModResolutionService;

    constructor(mods: ModResolutionService) {
        this.mods = mods;
    }

    public async onDisable(): Promise<void> {
        // Do nothing
    }

    public async onEnable(): Promise<void> {
        await this.mods.initModules("simple", __dirname, "commands");
        await this.mods.initModules("simple", __dirname, "events");
    }
}
