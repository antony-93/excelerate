import { ISocketServer } from "@domain/communication/interfaces/socketServer";
import { EVENTS } from "@domain/events/constants/events";
import { Subscriber } from "@shared/decorators/Subscriber";

export class ReloadController {
    constructor(private socketServer: ISocketServer) {}

    @Subscriber(EVENTS.FILE_CHANGED)
    async onFileChange() {
        console.log('PUTA MERDA QUE CÓDIGO GOSTOSO');
    }
}