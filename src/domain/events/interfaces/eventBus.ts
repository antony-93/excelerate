import { EVENTS } from "../constants/events";

export type TEventNames = typeof EVENTS[keyof typeof EVENTS];

export interface IEventBus {
    emit(event: TEventNames, data: any): void;
    subscribe(event: TEventNames, callback: (data: any) => void): void;
}