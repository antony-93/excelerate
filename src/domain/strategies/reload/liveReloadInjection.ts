import { IInjection } from "./injection";

export class LiveReloadInjection implements IInjection {
    getScript(): string {
        return `<script src="__excelarate_live" />`
    }
}