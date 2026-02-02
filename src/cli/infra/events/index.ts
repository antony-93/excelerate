
import { EventEmitter } from 'node:events';
import { mapSubscribers } from './mapper/subscriberMapper';
import { IEventBus, TEventNames } from '@domain/events/interfaces/eventBus';

export class NodeEventEmmiter implements IEventBus {
    constructor(private readonly eventEmitter: EventEmitter = new EventEmitter()) {}

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