import fp from 'fastify-plugin';
import { FastifyPluginAsync } from "fastify";
import { createHtmlInjectionHook } from "./htmlInjectionHook";
import { IInjection } from "@domain/reload/interfaces/injection";

type TApiMiddlewaresOption = { 
    injection: IInjection
}

const middlewares: FastifyPluginAsync<TApiMiddlewaresOption> = async (app, { injection }) => {
    app.addHook('onSend', createHtmlInjectionHook(injection));
};

export const apiMiddlewares = fp(middlewares);