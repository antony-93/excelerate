import { ReloadUseCase } from "@application/reloadUseCase";
import { EVENTS } from "@domain/events/constants/events";
import { Subscriber } from "@shared/decorators/Subscriber";

export class ReloadController {
    constructor(private readonly reloadUseCase: ReloadUseCase) {}

    @Subscriber(EVENTS.FILE_CHANGED)
    async onFileChange(path: string) {
        this.reloadUseCase.execute(path);
    }
}