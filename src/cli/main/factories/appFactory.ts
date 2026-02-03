import { TCommandArgs } from "@domain/config/interfaces/commandArgs";
import { App } from "src/cli/main";
import { makeFastifyHttpServer, makeNodeEventEmmiter, makeParcelWatcher, makePicomatchMatcher, makeWebSocketNotifier } from "./driversFactory";
import { makeConfigRepository } from "./repositoryFactory";

export const makeApp = async (commandArgs: TCommandArgs, workingDir: string): Promise<App> => { 
    const httpServer = makeFastifyHttpServer();
    const notifier = makeWebSocketNotifier();
    const eventBus = makeNodeEventEmmiter();
    const configRepository = makeConfigRepository(workingDir);
    
    const matcher = makePicomatchMatcher();

    const { 
        watcher: watcherConfig, 
        server: serverConfig 
    } = await configRepository.getConfig();

    const watcher = makeParcelWatcher(eventBus, matcher, watcherConfig, workingDir);

    return new App(
        commandArgs,
        httpServer,
        notifier,
        eventBus,
        serverConfig,
        watcher,
        workingDir
    );
};