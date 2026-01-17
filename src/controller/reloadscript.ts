import { Request, Response } from "express";
import reloadScriptService from "../services/reloadscript";

class reloadScriptController {
    recuperar = async (req: Request, res: Response) => {
        try {
            const script: string = reloadScriptService.script()
            res.status(200).send(script);
        } catch(error) {
            res.status(500).send('Internal Server Error')
        }
    }
}

export default new reloadScriptController()