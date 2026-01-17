import express, { Application } from 'express'
import { createServer, Server } from 'http';
import serverlogger from '../middlewares/serverlogger';
import router from '../routes';
import { formatServerListeningMessage, setServerHost } from '../const/server';
import os from 'os';
import portfinder from 'portfinder';

export default async (app: Application) => {
    const getLocalNetworkIP = () => {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]!) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        
        return 'localhost';
    }
    
    const onServerListening = (server: Server) => {
        const address = server.address(),
            port = typeof address === 'string' ? address : address?.port,
            localIP = getLocalNetworkIP();

        setServerHost(`localhost:${port}`)

        console.log(formatServerListeningMessage(`http://localhost:${port}`,`http://${localIP}:${port}`));
    }
    
    const create = (log: boolean): Server => {
        if (log) {
            app.use(serverlogger)
        }
    
        router(app)
        
        app.use(express.static(process.cwd()));

        return createServer(app);
    }

    const getPort = async (portRequested: number) => {
        portfinder.basePort = portRequested;
        return await portfinder.getPortPromise();
    }

    return { create, onServerListening, getPort };
}