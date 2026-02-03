import { INotifier } from "@domain/communication/interfaces/notifier";
import { IConfigRepository } from "@domain/config/repository/configRepository";
import { IMatcher } from "@domain/matcher/interfaces/matcher";
import { IReloadUseCase } from "./reloadUseCase";

export class FullReloadUseCase implements IReloadUseCase {
    constructor(
        private readonly notifier: INotifier,
        private readonly configRepository: IConfigRepository,
        private readonly matcher: IMatcher
    ) { }

    async execute(path: string): Promise<void> {
        const { watcher } = await this.configRepository.getConfig();

        const isLive = this.matcher.isMatch(path, watcher.live, watcher.exclude);
        
        if (isLive) {
            this.notifier.notify({ type: 'live', path });
            return console.log('🔄 [LIVE] ' + path);
        }
        
        const isHot = this.matcher.isMatch(path, watcher.include, watcher.exclude);
        
        if (isHot) {
            this.notifier.notify({ type: 'hot', path });
            console.log('🔥 [HOT] ' + path);
        }
    }
}