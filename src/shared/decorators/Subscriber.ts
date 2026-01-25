import 'reflect-metadata';
import { TEventNames } from '@domain/events/interfaces/eventBus';

export const SUBSCRIBER_METADATA_KEY = Symbol('subscriber_events');

export interface SubscriberDefinition {
    eventName: TEventNames;
    methodName: string;
}

export function Subscriber(eventName: TEventNames) {
    return (target: any, propertyKey: string) => {
        const metadata = Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, target) as SubscriberDefinition[];

        const subscribers: SubscriberDefinition[] = metadata || [];

        subscribers.push({
            eventName,
            methodName: propertyKey,
        });

        Reflect.defineMetadata(SUBSCRIBER_METADATA_KEY, subscribers, target);
    };
}