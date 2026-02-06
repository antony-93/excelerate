import { IReload, TReloadOptions } from "../reload";

export class HotReload implements IReload {
    async execute({ path }: TReloadOptions) {
        try {
            const className = this.getClassNameByPath(path);
            const canHotReload = this.canHotReload(className);
    
            if (!canHotReload) return;
    
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
            prototype.isViewModel && this.getComponentsByViewModelClassName,
            prototype.isModel && this.getComponentsByModelClassName,
        ].filter(Boolean);

        const queryAction = queryActions[0] || this.getComponentsByDependencies;

        const components = queryAction(className);

        components.forEach(this.reconstructCmp);
    }

    private getComponentsByClassName(className: string) {
        return Ext.ComponentQuery.query(`component{self.$className === "${className}"}`);
    }

    private getComponentsByControllerClassName(className: string) {
        return Ext.ComponentQuery.query(`component:controllerClass(${className})`);
    }
    
    private getComponentsByViewModelClassName(className: string) {
        return Ext.ComponentQuery.query(`component:viewModelClass(${className})`);
    }


    private getComponentsByModelClassName(className: string) {
        return Ext.ComponentQuery.query(`component:modelClass"${className}"}`);
    }

    private getComponentsByDependencies(className: string) {
        return Ext.ComponentQuery.query(`component:dependentClasses(${className})`);
    }

    private reconstructCmp($cmp: any) {
        const $parent = $cmp.up();

        if (!$parent) {
            console.log("♻️ [Excelerate] Root component detectado. Tentando refresh via Viewport.");
            return location.reload();
        }

        const cmpContext = {
            hasFocus: $cmp.hasFocus || $cmp.containsFocus,
            activeTab: $parent.getActiveTab ? ($parent.getActiveTab() === $cmp) : false,
            scrollPos: $cmp.getScrollable?.()?.getPosition() || null
        };

        const cmpIndex = $parent.items.indexOf($cmp);

        const $newCmp = Ext.create($cmp.$className); 

        try {
            $parent.suspendLayouts();
            $parent.suspendEvents?.();

            $parent.remove($cmp, {
                destroy: true
            });
            
            $parent.insert(cmpIndex, $newCmp);

            if (cmpContext.activeTab && $parent.setActiveTab) {
                $parent.setActiveTab($newCmp);
            }

            Ext.defer(() => {
                if (cmpContext.hasFocus && $newCmp.focus) {
                    $newCmp.focus();
                }

                if (cmpContext.scrollPos && $newCmp.getScrollable?.()) {
                    $newCmp.getScrollable().scrollTo(cmpContext.scrollPos.x, cmpContext.scrollPos.y);
                }
            }, 30);

            console.log(`✨ [Excelerate] UI Reconstruída: ${$cmp.id}`);
        } finally {
            $parent.resumeEvents?.();
            $parent.resumeLayouts(true);
        }
    }

    private canHotReload(className: string) {
        const definedClass = Ext.ClassManager.get(className);
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