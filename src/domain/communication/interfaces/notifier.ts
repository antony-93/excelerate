export interface INotifier {
    initialize(server: any): void;
    notify(message: Record<string, any>): void;
    close(): void;
}