import { EventEmitter } from 'events'
import { lstatSync, readdirSync } from 'fs'
import hound from 'hound'
import { createRequire } from 'node:module'
import path, { relative, resolve } from 'path'
import { Logger } from '../../structures/util/Logger'

export class Registry extends EventEmitter {
  constructor(options) {
    super()

    this.path = path.resolve(options.path) || process.exit()
    this.autoReload = options.autoReload || true

    this.modules = []
    if (this.autoReload) this.startWatcher()
  }

  loadModule(path) {
    try {
      const require = createRequire(resolve(path))
      delete require.cache[require.resolve(path)]

      import('file://' + resolve(relative(process.cwd(), path))).then(({ default: ModuleDefault }) => {
        const module = new ModuleDefault()
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

  loadAll(path) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    readdirSync(path).forEach((file) => {
      const fullpath = resolve(path, file)
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (lstatSync(fullpath).isDirectory()) {
        return this.loadAll(fullpath)
      }
      this.loadModule(fullpath)
    })
  }

  deleteModule(obj) {
    this.modules.splice(this.modules.findIndex((a) => a.__path === obj.__path), 1)
    this.emit('removal', obj)
  }

  reloadModule(object, safeReload = true) {
    try {
      // "TypeError: Cannot read properties of undefined (reading '__path')"
      if (object === undefined && object?.__path === undefined) return

      const obj = this.modules.filter(a => a.__path === object.__path)[0]
      this.deleteModule(obj)
      if (this.loadModule(obj.__path)) {
        return true
      } else {
        if (safeReload) {
          this.modules.push(obj)
          this.emit('load', obj)
        }
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }

  reloadAllModules(safeReload = true) {
    this.modules.forEach((module) => this.reloadModule(module.__path, safeReload))
  }

  startWatcher() {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const watcher = hound.watch(this.path)

    // eslint-disable-next-line no-unused-vars
    watcher.on('create', (file) => setTimeout(() => this.loadAll(this.path), 2000))
    watcher.on('change', (file) => setTimeout(() => this.reloadModule(this.findByFileName(file)), 2000))
    watcher.on('delete', (file) => setTimeout(() => this.deleteModule(this.findByFileName(file)), 2000))
  }

  findByProperty(property, value) {
    return this.modules.filter((a) => a[typeof property === 'string' ? property : null] === value)[0]
  }

  findByFileName(path) {
    return this.modules.filter((a) => a.__path === path)[0]
  }
}
