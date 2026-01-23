import { FastifyInstance } from "fastify";
import { createHtmlInjectionHook } from "./htmlInjectionHook";
import { Injection } from "../../../domain/strategies/reload/injection";

type ApiMiddlewaresProps = {
    app: FastifyInstance; 
    injection: Injection; 
    logger: boolean;
}

export const apiMiddlewares = ({ app, injection, logger }: ApiMiddlewaresProps) => {
    app.addHook('onSend', createHtmlInjectionHook(injection));
};