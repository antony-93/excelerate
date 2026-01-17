import { Application, Router } from "express";
import reloadScript from "./reloadscript";
import indexhtmlcontroller from "../controller/indexhtml";

export default (app: Application) => {
    app.get('/', indexhtmlcontroller.recuperar)
    
    reloadScript(app)
}