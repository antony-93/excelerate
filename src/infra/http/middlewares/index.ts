import { FastifyInstance } from "fastify";
import { createHtmlInjectionHook } from "./htmlInjectionHook";
import { IInjection } from "@domain/reload/interfaces/injection";

type TApiMiddlewares = {
    app: FastifyInstance; 
    injection: IInjection
}

export const apiMiddlewares = ({ app, injection }: TApiMiddlewares) => {
    app.addHook('onSend', createHtmlInjectionHook(injection));
};