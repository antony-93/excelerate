import WebSocket, { Server } from "ws";
import fs from 'fs';
import path from 'path'
import { HmrMessage } from "../model/hmrmessage";
import chokidar from "chokidar";

export default async function (paths: string[], wss: Server, browserReload: boolean) {
    const hotModuleReload = (filepath: string) => {
        fs.readFile(path.join(process.cwd(), filepath), 'utf8', (err, data) => {
            if (err) {
                console.error(`Erro ao ler o arquivo: ${err}`);
                return;
            }
    
            const classNameMatch = data.match(/Ext\.define\(\s*['"]([^'"]+)['"]/);
            if (classNameMatch && classNameMatch[1]) {
                const className = classNameMatch[1];
    
                sendHmrMessage(new HmrMessage(`/${filepath.replace(/\\/g, '/')}`, className));
            } else {
                console.warn(`Classe não encontrada no arquivo: ${filepath}`);
            }
        });
    }

    const sendHmrMessage = (hmrmessage: HmrMessage) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(hmrmessage));
            }
        });
    }

    const reloadBrowserPage = () => {
        sendReloadPage()
    }

    const sendReloadPage = () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ reload: true }));
            }
        })
    }
    
    const watchDirectory = (directory: string) => {
        const watcher = chokidar.watch(directory, {
            persistent: true,
            ignoreInitial: true,
        });
    
        watcher.on('change', (filepath) => {
            if (filepath) {
                if (browserReload) {
                    reloadBrowserPage()
                    return;
                }
    
                hotModuleReload(filepath)
            }
        })
    };

    const watchDirectorys = (directorys: string[]) => {
        for (const directory of directorys) {
            watchDirectory(directory)
        }
    }

    watchDirectorys(paths)
}