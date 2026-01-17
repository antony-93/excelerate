import { Request, Response } from "express";
import indexthtmlservice from "../services/indexthtml";

class indexhtmlcontroller {
    recuperar = async (req: Request, res: Response) => {
        try {
            const indexhtml: string = await indexthtmlservice.formatarIndexHtml()
            res.status(200).send(indexhtml)
        } catch(error) {
            res.status(500).json('Internal Server Error')
        }
    }
}

export default new indexhtmlcontroller()