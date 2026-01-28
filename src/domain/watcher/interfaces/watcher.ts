import { TWatcherConfig } from "@domain/config/interfaces/config";

export interface IWatcher {
    start(workingDir: string): Promise<void>;
    stop(): Promise<void>;
    config(config: TWatcherConfig): void;
}