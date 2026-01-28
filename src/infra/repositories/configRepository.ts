import path from "node:path";
import { FILE_CONFIG } from "@domain/config/const/config";
import { IConfigRepository } from "@domain/config/repository/configRepository";
import { IConfig } from "@domain/config/interfaces/config";

export class ConfigRepository implements IConfigRepository {
    private readonly configPath: string;

    constructor(workingDirectory: string) {
        this.configPath = path.resolve(workingDirectory, FILE_CONFIG);
    }

    async getConfig() {
        const defaulConfig = this.getDefaultConfig();

        try {
            const module = await import(this.configPath);

            const userConfig = module.default || module;

            return { ...defaulConfig, ...userConfig };
        } catch {
            console.warn('Arquivo de configuração não encontrado, usando configuração padrão!');
            
            return defaulConfig;
        }
    }

    private getDefaultConfig(): IConfig {
        return {
            watcher: {
                include: ['app/**/*.js', 'packages/local/**/*.js'],
                exclude: ['**/node_modules/**', 'build/**', 'packages/local/**/build/**']
            },
            server: { 
                port: 3000 
            }
        };
    }
}