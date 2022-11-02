/* eslint-disable semi */
// NOTE(dylhack): because the semi rule is broken in eslint

export default interface IModule {
    onEnable(): Promise<void>;

    onDisable(): Promise<void>;
}
