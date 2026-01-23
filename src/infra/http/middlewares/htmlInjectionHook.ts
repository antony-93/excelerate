import { FastifyReply, FastifyRequest, onSendHookHandler } from "fastify";
import { Injection } from "../../../domain/strategies/reload/injection";

export const createHtmlInjectionHook = (injectionScript: Injection): onSendHookHandler => {
    return async (_request: FastifyRequest, reply: FastifyReply, payload: unknown) => {
        const contentType = String(reply.getHeader('content-type'));
    
        if (!contentType.includes('text-html') || !payload) {
            return payload;
        }
        
        const scriptToInject = injectionScript.getScript();

        return payload.toString().replace('</body>', `${scriptToInject}</body>`);
    }
};