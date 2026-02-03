import { IReload, TReloadOptions } from "../reload";

export class HotReload implements IReload {
    async execute({ path }: TReloadOptions) {
        try {
            const className = this.getClassNameByPath(path);
            const canHotReload = this.canHotReload(className);
    
            if (!canHotReload) {
                return window.location.reload();
            }
    
            await this.reloadClass(path, className);
            this.reconcileUI(className);
        } catch(error) {
            console.error(error);
        }
    }

    private reconcileUI(className: string) {
        const cls = Ext.ClassManager.get(className);
        const prototype = cls.prototype;

        const queryActions = [
            prototype.isComponent && this.getComponentsByClassName,
            prototype.isController && this.getComponentsByControllerClassName,
            prototype.isViewModel && this.getComponentsByControllerViewModel
        ].filter(Boolean);

        if (!queryActions.length) {
            return console.info(`⚠️ [Excelerate] Não foi possivel reconciliar a classe ${className}`)
        }

        const [queryAction] = queryActions;

        const components = queryAction(className);

        components.forEach(this.reconstructCmp);
    }

    private getComponentsByControllerClassName(className: string) {
        return Ext.ComponentQuery.query(`component:controllerClass(${className})`);
    }
    
    private getComponentsByControllerViewModel(className: string) {
        return Ext.ComponentQuery.query(`component:viewModelClass(${className})`);
    }

    private getComponentsByClassName(className: string) {
        return Ext.ComponentQuery.query(`component{self.$className === "${className}"}`);
    }

    private reconstructCmp($cmp: any) {
        const $parent = $cmp.up();

        if (!$parent) {
            console.log("♻️ [Excelerate] Root component detectado. Tentando refresh via Viewport.");
            return location.reload();
        }

        const cmpIndex = $parent.items.indexOf($cmp);

        const cmpConfig = Ext.apply({}, $cmp.initialConfig);

        try {
            $parent.suspendLayouts();
            $parent.remove($cmp, true);
            $parent.insert(cmpIndex, cmpConfig);
            console.log(`✨ [Excelerate] UI Reconstruída: ${$cmp.id}`);
        } finally {
            $parent.resumeLayouts(true);
        }
    }

    private canHotReload(className: string) {
        const definedClass: unknown = Ext.ClassManager.get(className);
        return Boolean(definedClass);
    }

    private reloadClass(path: string, className: string) {
        Ext.undefine(className);

        const url = `${path}?_excelerate_dc=${Date.now()}`;

        return new Promise<void>((resolve, reject) => {
            Ext.Loader.loadScript({
                url,
                onLoad: () => {
                    resolve();
                },
                onError: () => {
                    reject(`❌ [Excelerate] Erro ao carregar o arquivo físico em: ${path}`);
                }
            });
        })
    }

    private getClassNameByPath(path: string) {
        const classPaths: Record<string, string> = Ext.ClassManager.paths;

        const prefixes = Object.keys(classPaths);

        const prefix = prefixes.find(key => (
            path.includes(classPaths[key])
        ));

        const name = path
            .replace(classPaths[prefix ?? prefixes[0]], '')
            .replace('.js', '')
            .replaceAll('/', '.');

        return prefix + name;
    }
}