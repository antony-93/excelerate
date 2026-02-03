import { AsyncSubscription, subscribe, Event } from '@parcel/watcher';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { EVENTS } from '@domain/events/constants/events';
import { IWatcher } from '@domain/watcher/interfaces/watcher';
import { TWatcherConfig } from '@domain/config/interfaces/config';
import { IMatcher } from '@domain/matcher/interfaces/matcher';

export class ParcelWatcher implements IWatcher {
    private subscription: AsyncSubscription | null = null;

    private debounceTimers = new Map<string, NodeJS.Timeout>();

    constructor(
        private readonly eventBus: IEventBus,
        private readonly matcher: IMatcher,
        private readonly watcherConfig: TWatcherConfig,
        private readonly workingDir: string
    ) { }

    async start() {
        this.subscription = await subscribe(this.workingDir, (err, events) => {
            if (err) return;

            this.onFileEvents(events);
        });
    }

    async stop() {
        if (!this.subscription) return;

        await this.subscription.unsubscribe();

        this.subscription = null;
    }

    private onFileEvents(events: Event[]) {
        const filteredEvents = events.filter(e => e.type !== 'delete');

        filteredEvents.forEach(({ path }) => {
            this.debounceEmit(path);
        });
    }

    private debounceEmit(path: string) {
        if (this.debounceTimers.has(path)) {
            clearTimeout(this.debounceTimers.get(path)!);
        }
    
        const timer = setTimeout(() => {
            this.debounceTimers.delete(path);
    
            const relativePath = this.getRelativePath(path);
            const isIncluded = this.isIncluded(relativePath);
    
            if (isIncluded) {
                this.eventBus.emit(EVENTS.FILE_CHANGED, relativePath);
            }
        }, 150);
    
        this.debounceTimers.set(path, timer);
    }

    private getRelativePath(path: string) {
        const normalizedPath = path.replace(/\\/g, '/');
        const normalizedBase = this.workingDir.replace(/\\/g, '/');

        let relativePath = normalizedPath.replace(normalizedBase, '');

        if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);

        return relativePath
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