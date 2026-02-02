import { IReload } from "../reload";

export class LiveReload implements IReload {
    execute() {
        location.reload();
    }
}