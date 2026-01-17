import boxen from "boxen";
import chalk from "chalk";

export const formatServerListeningMessage = (localUrl: string, networkUrl: string) => { return boxen(`
${chalk.green('Serving!')}

${chalk.white.bold('- Local:')}      ${chalk.cyan(localUrl)}
${chalk.white.bold('- Network:')}    ${chalk.cyan(networkUrl)}

${chalk.gray('Copied local address to clipboard!')}
`, {
    margin: 1,
    padding: 1,
    borderColor: 'green',
})}

export const reloadScript = (url: string) => {return `
const socket = new WebSocket('ws://${url}');

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data?.reload) {
        reloadPage();
        return;
    }

    hotReload(data);
};

function removeScript(script) {
    script.parentNode.removeChild(script);
}

function addScript(src, className) {
    const newScript = document.createElement('script');
                
    newScript.type = 'text/javascript';   
    newScript.src = src;
    
    newScript.onload = function() {
        reloadComponents(className)
    }

    document.head.appendChild(newScript);
}
    
function reloadPage() {
    $(window).off('beforeunload');
    window.location.reload(true);
}
    
function hotReload({ script, className }) {
    const reloadScript = findMostSimilarScript(script)
    
    if (reloadScript) {
        removeScript(reloadScript);
        addScript(reloadScript.src, className);
    }
}

function findMostSimilarScript(scriptUrl) {
    const scripts = document.head.querySelectorAll('script'),
        baseScriptUrl = scriptUrl.toLowerCase().replace(new RegExp('\\/{2}', 'g'), '/');

    return Array.from(scripts).find((script) => {
        const baseCurrentSrc = script.src.toLowerCase().replace(new RegExp('\\/{2}', 'g'), '/');

        return baseCurrentSrc.includes(baseScriptUrl);
    });
}
  
function reloadComponents(className) {
    Ext.ComponentManager.each(function(id) {
        const $cmp = Ext.ComponentManager.get(id);

        if (!$cmp) return;

        if ($cmp.$className !== className) return;
                
        const parent = $cmp.up(); 
                
        if (!parent) return;

        let isActiveTab = false

        if (parent.isXType('tabpanel')) {
            const activeTab = parent.getActiveTab();

            if (activeTab.$className === $cmp.$className) {
                isActiveTab = true
            }
        }
                
        parent.remove($cmp);
                
        const newComponent = Ext.create($cmp.$className);
                
        parent.add(newComponent);

        if (!isActiveTab) return;

        parent.setActiveTab(newComponent);
    });
}`}

let host: string = ''

export const setServerHost = (newHost: string) => {
    host = newHost
}

export const getServerHost = () => {
    return host;
}