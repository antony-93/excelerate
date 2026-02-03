import 'reflect-metadata';
import { IEventBus } from '@domain/events/interfaces/eventBus';
import { SUBSCRIBER_METADATA_KEY, SubscriberDefinition } from '@shared/decorators/Subscriber';

export function mapSubscribers(subscriberInstance: any, eventBus: IEventBus) {
    const prototype = Object.getPrototypeOf(subscriberInstance);

    const metadata = Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, prototype) as SubscriberDefinition[];

    const subscribers = metadata || [];

    subscribers.forEach(s => {
        eventBus.subscribe(s.eventName, (...args: any[]) => {
            subscriberInstance[s.methodName](...args);
        });
    });
}