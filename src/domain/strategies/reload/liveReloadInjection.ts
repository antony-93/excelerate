import { IInjection } from "./injection";

export class LiveReloadInjection implements IInjection {
    getScript(): string {
        return '__excelarate_live'
    }
}