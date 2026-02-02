import { IConfigRepository } from "@domain/config/repository/configRepository";
import { ConfigRepository } from "@infra/repositories/configRepository";

export const makeConfigRepository = (workingDir: string): IConfigRepository => {
    return new ConfigRepository(workingDir);
};