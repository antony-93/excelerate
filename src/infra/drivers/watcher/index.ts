import pm from 'picomatch';
import { AsyncSubscription, subscribe, Event } from '@parcel/watcher';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { EVENTS } from '@domain/events/constants/events';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { TWatcherConfig } from '@domain/config/interfaces/config';

export class ParcelWatcher implements IWatcher {
    private isIncluded!: (path: string) => boolean;
    private subscription: AsyncSubscription | null = null;

    constructor(private readonly eventBus: IEventBus) { }

    async start(workingDir: string) {
        this.subscription = await subscribe(workingDir, (err, events) => {
            if (err) return;

            this.onFileEvents(workingDir, events);
        });
    }

    config(config: TWatcherConfig) {
        const configInclude = config.include || [];
        const configLive = config.live || [];

        this.isIncluded = pm([...configInclude, ...configLive], {
            ignore: config.exclude
        });
    }

    async stop() {
        if (!this.subscription) return;

        await this.subscription.unsubscribe();

        this.subscription = null;
    }

    private onFileEvents(workingDir: string, events: Event[]) {
        events.filter(e => e.type !== 'delete').forEach(event => {
            const normalizedFilePath = event.path.replace(/\\/g, '/');
            const normalizedWorkingDir = workingDir.replace(/\\/g, '/');

            let relativePath = normalizedFilePath.replace(normalizedWorkingDir, '');

            if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);

            const isIncluded = this.isIncluded(relativePath);

            if (isIncluded) this.eventBus.emit(EVENTS.FILE_CHANGED, event.path);
        });
    }
}