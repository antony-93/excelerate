import { FastifyReply, FastifyRequest, onSendHookHandler } from "fastify";
import { Injection } from "../../../domain/strategies/reload/injection";

export const createHtmlInjectionHook = (injectionScript: Injection): onSendHookHandler => {
    return async (_request: FastifyRequest, reply: FastifyReply, payload: unknown) => {
        const contentType = String(reply.getHeader('content-type'));
    
        if (!contentType.includes('text-html') || !payload) {
            return payload
        }
        
        const content = payload.toString();
    
        if (content.includes('</body>')) {
            return payload;
        }
    
        const scriptToInject = `<script src="${injectionScript.getScript()}"/>`

        return content.replace('</body>', `${scriptToInject}</body>`);
    }
};