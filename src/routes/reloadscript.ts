import { Application, Router } from "express";
import reloadScriptController from "../controller/reloadscript";

const route = Router()

export default (app: Application) => {
    app.use(route)

    route.get('/reload.js', reloadScriptController.recuperar)
}