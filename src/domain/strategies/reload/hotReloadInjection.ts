import { IInjection } from "./injection";

export class HotReloadInjection implements IInjection {
    getScript(): string {
        return '__excelarate_hmr'
    }
}