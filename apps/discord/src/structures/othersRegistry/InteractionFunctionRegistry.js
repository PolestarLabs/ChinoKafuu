import { createRequire } from 'node:module'
import { relative, resolve } from 'path'
import { Logger } from '../../structures/util/Logger'
import { Registry } from '../registry/Registry'

export class InteractionFunctionRegistry extends Registry {
  constructor(path = resolve('src/interactionFunctions')) {
    super({ path, autoReload: process.env.ENABLE_REGISTRY_RELOAD || !process.env.PRODUCTION })

    this.loadAll(this.path)
  }

  loadModule(path) {
    try {
      const require = createRequire(resolve(path))
      delete require.cache[require.resolve(path)]

      import('file://' + resolve(relative(process.cwd(), path))).then(({ default: ModuleDefault }) => {
        const module = ModuleDefault.mode === undefined ? new ModuleDefault() : ModuleDefault
        if (this.modules.filter((a) => a.__path === path)[0]) return true
        module.__path = path
        this.modules.push(module)
        this.emit('load', module)

      })
      return true
    } catch (e) {
      Logger.error(`Error loading ${path}: ${e.stack}`)
      return false
    }
  }

  findByProperty(property, value) {
    return this.modules.filter((a) => {
      const resolveModule = (a?.mode !== undefined && a?.mode === 'define') ? a.T : a
      return resolveModule[typeof property === 'string' ? property : null] === value
    })[0]
  }

  findByName(name) {
    return this.findByProperty('interactionName', name)
  }

  filterByCategory(category) {

    return this.modules.filter((cmd) =>
      cmd.__path
        .replace(/(\/+|\\+)([a-zA-Z0-9_.,]+)\.js/, '') // Remove file name.
        .trim()
        .replace(/(.(.*)(interactionFunctions)|(\/+|\\+)|(^[a-zA-Z0-9_.,])(\/+|\\+))/, '') // Remove all encounters from the folder.
        .split(/(\\+|\/+)/g).includes(category))
  }
}
