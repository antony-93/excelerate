import { ReloadController } from "@presentation/controllers/reloadController";
import { makeReloadUseCase } from "./useCaseFactory";
import { TCommandArgs } from "@domain/config/interfaces/commandArgs";

export const makeReloadController = (workingDir: string, commandArgs: TCommandArgs): ReloadController => {
    const reloadUseCase = makeReloadUseCase(workingDir, commandArgs);
    return new ReloadController(reloadUseCase);
};