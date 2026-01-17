import { getServerHost, reloadScript } from "../const/server"

class reloadScriptService {
    script(): string {
        return reloadScript(getServerHost())
    }
}

export default new reloadScriptService()