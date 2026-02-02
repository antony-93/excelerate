import { IReloadUseCase } from "@application/reload/reloadUseCase";
import { EVENTS } from "@domain/events/constants/events";
import { Subscriber } from "@shared/decorators/Subscriber";

export class ReloadController {
    constructor(private readonly reloadUseCase: IReloadUseCase) {}

    @Subscriber(EVENTS.FILE_CHANGED)
    async onFileChange(path: string) {
        this.reloadUseCase.execute(path);
    }
}