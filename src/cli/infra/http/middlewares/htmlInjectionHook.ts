import { FastifyReply, FastifyRequest, onSendHookHandler } from "fastify";
import { IInjection } from "@domain/reload/interfaces/injection";
import { Readable, Transform } from "node:stream";

export const createHtmlInjectionHook = (injectionScript: IInjection): onSendHookHandler => {
    return async (_request: FastifyRequest, reply: FastifyReply, payload) => {
        const contentType = String(reply.getHeader('content-type'));

        if (!contentType.includes('text/html') || !(payload instanceof Readable)) {
            return payload;
        }

        reply.removeHeader('content-length');

        const scriptToInject = injectionScript.getScript();

        const transformer = new Transform({
            transform(chunk, _encoding, cb) {
                const html = chunk.toString();
                
                const formatedHtml = html.replace('</body>', `${scriptToInject}\n</body>`);

                cb(null, formatedHtml);
            }
        });

        return payload.pipe(transformer);
    }
};