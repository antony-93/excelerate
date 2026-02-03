import { IConfig } from "../interfaces/config";

export interface IConfigRepository {
    getConfig(): Promise<IConfig>;
}