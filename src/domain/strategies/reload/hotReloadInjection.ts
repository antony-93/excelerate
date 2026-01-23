import { IInjection } from "./injection";

export class HotReloadInjection implements IInjection {
    getScript(): string {
        return `<script src="__excelarate_hmr" />`
    }
}