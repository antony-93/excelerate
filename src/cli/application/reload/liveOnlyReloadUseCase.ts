import { INotifier } from "@domain/communication/interfaces/notifier";
import { IReloadUseCase } from "./reloadUseCase";
import { IConfigRepository } from "@domain/config/repository/configRepository";
import { IMatcher } from "@domain/matcher/interfaces/matcher";

export class LiveOnlyReloadUseCase implements IReloadUseCase {
    constructor(
        private readonly notifier: INotifier,
        private readonly configRepository: IConfigRepository,
        private readonly matcher: IMatcher
    ) { }

    async execute(path: string) {
        const { watcher } = await this.configRepository.getConfig();

        const isIncluded = this.matcher.isMatch(path, watcher.live, watcher.exclude);

        if (isIncluded) this.notifier.notify({ type: 'live' });
    }
}