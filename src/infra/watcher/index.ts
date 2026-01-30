import { AsyncSubscription, subscribe, Event } from '@parcel/watcher';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { EVENTS } from '@domain/events/constants/events';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { TWatcherConfig } from '@domain/config/interfaces/config';
import { IMatcher } from '@domain/matcher/interfaces/matcher';

export class ParcelWatcher implements IWatcher {
    private subscription: AsyncSubscription | null = null;

    constructor(
        private readonly eventBus: IEventBus,
        private readonly matcher: IMatcher,
        private readonly watcherConfig: TWatcherConfig
    ) { }

    async start(workingDir: string) {
        this.subscription = await subscribe(workingDir, (err, events) => {
            if (err) return;

            this.onFileEvents(workingDir, events);
        });
    }

    async stop() {
        if (!this.subscription) return;

        await this.subscription.unsubscribe();

        this.subscription = null;
    }

    private onFileEvents(workingDir: string, events: Event[]) {
        const filteredEvents = events.filter(e => e.type !== 'delete');

        filteredEvents.forEach(({ path }) => {
            const isIncluded = this.isIncluded(path);
            if (isIncluded) this.eventBus.emit(EVENTS.FILE_CHANGED, path);
        });
    }

    private isIncluded(path: string) {
        const include = this.watcherConfig.include || [];
        const live = this.watcherConfig.live || [];

        return this.matcher.isMatch(
            path,
            [...include, ...live],
            this.watcherConfig.exclude
        );
    }
}