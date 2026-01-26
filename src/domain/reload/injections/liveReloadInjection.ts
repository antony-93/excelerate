import { EXCELERATE_INTERNAL_PREFIX } from "@domain/communication/const/server";
import { IInjection } from "../interfaces/injection";

export class LiveReloadInjection implements IInjection {
    getScript(): string {
        return `<script src="${EXCELERATE_INTERNAL_PREFIX}/live.js"></script>`
    }
}