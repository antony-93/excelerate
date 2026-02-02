import { ReloadType } from "src/hmr/interfaces/reload";
import { HotReload } from "../hot";
import { LiveReload } from "../live";
import { IReload } from "../reload";

let hotReloadInstance: HotReload | null = null;
let liveReloadInstance: LiveReload | null = null;

export function makeReload(type: ReloadType): IReload {
    return type === 'live'
        ? makeLiveReload()
        : makeHotReload();
}

function makeLiveReload() {
    if (!liveReloadInstance) liveReloadInstance = new LiveReload();
    return liveReloadInstance
}

function makeHotReload() {
    if (!hotReloadInstance) hotReloadInstance = new HotReload();
    return hotReloadInstance
}