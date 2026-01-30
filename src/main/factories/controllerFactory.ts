import { ReloadController } from "@presentation/controllers/reloadController";
import { makeReloadUseCase } from "./useCaseFactory";

export const makeReloadController = (workingDir: string): ReloadController => {
    const reloadUseCase = makeReloadUseCase(workingDir);
    return new ReloadController(reloadUseCase);
};