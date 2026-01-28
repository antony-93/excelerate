import { HotReloadInjection, LiveReloadInjection } from "@domain/reload/injections";
import { IInjection } from "@domain/reload/interfaces/injection";

export class InjectionScriptFactory {
    static create(live: boolean): IInjection {
        return live ? new LiveReloadInjection() : new HotReloadInjection();
    }
}