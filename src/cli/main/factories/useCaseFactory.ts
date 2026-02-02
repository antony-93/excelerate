import { TCommandArgs } from "@domain/config/interfaces/commandArgs";
import { makePicomatchMatcher, makeWebSocketNotifier } from "./driversFactory";
import { makeConfigRepository } from "./repositoryFactory";
import { LiveOnlyReloadUseCase } from "@application/reload/liveOnlyReloadUseCase";
import { FullReloadUseCase } from "@application/reload/fullReloadUseCase";
import { IReloadUseCase } from "@application/reload/reloadUseCase";

export const makeReloadUseCase = (workingDir: string, commandArgs: TCommandArgs): IReloadUseCase => {
    const notifier = makeWebSocketNotifier();
    const configRepository = makeConfigRepository(workingDir);
    const matcher = makePicomatchMatcher();

    return commandArgs.live
        ? new LiveOnlyReloadUseCase(notifier, configRepository, matcher)
        : new FullReloadUseCase(notifier, configRepository, matcher);
};