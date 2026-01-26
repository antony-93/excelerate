
import { EventEmitter } from 'node:events';
import { mapSubscribers } from './mapper/subscriberMapper';
import { IEventBus, TEventNames } from '@domain/events/interfaces/eventBus';

export class EventBus implements IEventBus {
    constructor(private readonly eventEmitter: EventEmitter) {}

    static registerSubscriber(subscriber: any, eventBus: IEventBus) {
        mapSubscribers(subscriber, eventBus);
    }

    emit(event: TEventNames, ...data: any[]): void {
        this.eventEmitter.emit(event, ...data);
    }

    subscribe(event: TEventNames, callback: (...data: any[]) => void): void {
        this.eventEmitter.on(event, callback);
    };
}