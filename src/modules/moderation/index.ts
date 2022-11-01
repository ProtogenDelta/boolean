import IModule from "../../interfaces/IModule";
import ModResolutionService from "../../services/ModResolutionService";

export default class ModModule implements IModule {
    private readonly mods: ModResolutionService;

    constructor(mods: ModResolutionService) {
        this.mods = mods;
    }

    public async onDisable(): Promise<void> {}

    public async onEnable(): Promise<void> {
        await this.mods.initModules("moderation", __dirname, "commands");
    }
}
