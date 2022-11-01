import IModule from "../../interfaces/IModule";
import ModResolutionService from "../../services/ModResolutionService";

export default class RoleMenuModule implements IModule {
    private readonly mods: ModResolutionService;

    constructor(mods: ModResolutionService) {
        this.mods = mods;
    }

    public async onDisable(): Promise<void> {}

    public async onEnable(): Promise<void> {
        await this.mods.initModules("rolemenu", __dirname, "commands");
    }
}
