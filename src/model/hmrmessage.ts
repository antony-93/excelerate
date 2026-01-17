import { hmrmessage } from "../interfaces/hmrmessage.interface";

export class HmrMessage implements hmrmessage {
    constructor(script: string, className: string) {
        this.className = className
        this.script = script
    }

    script: string

    className: string
}