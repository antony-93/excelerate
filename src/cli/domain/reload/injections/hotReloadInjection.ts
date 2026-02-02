import { EXCELERATE_INTERNAL_PREFIX } from "@domain/communication/const/server";
import { IInjection } from "../interfaces/injection";

export class HotReloadInjection implements IInjection {
    getScript(): string {
        return `<script type="module" src="${EXCELERATE_INTERNAL_PREFIX}/hmr.js"></script>`
    }
}