import { INotifier } from "@domain/communication/interfaces/notifier";

export class ReloadUseCase {
    constructor(private readonly notifier: INotifier) {}

    execute(path: string) {
        const message = {
            type: 'hot',
            path
        }

        this.notifier.notify(message)
    }
}