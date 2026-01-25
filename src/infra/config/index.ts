import path from 'path';
import fs from 'fs';
import { IConfig, IExcelerateConfig } from '@domain/config/interfaces/excelerateConfig';

export class ExcelarateConfig implements IExcelerateConfig {
    private readonly configPath: string;

    constructor(workingDirectory: string) {
        this.configPath = path.resolve(
            workingDirectory, 
            'excelerate.config.js'
        );
    }

    public async getConfig() {
        const existsConfigFile = this.existsConfigFile(); 
        
        if (!existsConfigFile) return this.getDefaultConfig();

        return this.getConfigByFile();
    }

    private existsConfigFile() {
        return fs.existsSync(this.configPath);
    }

    private async getConfigByFile(): Promise<IConfig> {
        const defaulConfig = this.getDefaultConfig();

        try {
            const userConfig = await import(this.configPath);

            return { ...defaulConfig, ...userConfig };
        } catch (error) {
            console.warn('❌ Erro ao processar arquivo de configuração, usando defaults.');
            
            return defaulConfig;
        }
    }

    private getDefaultConfig(): IConfig {
        return {
            watcher: {
                include: ['app/**/*.js', 'packages/local/**/*.js'],
                exclude: ['**/node_modules/**', 'build/**', 'packages/local/**/build/**'],
            },
            server: { 
                port: 3000 
            }
        };
    }
}