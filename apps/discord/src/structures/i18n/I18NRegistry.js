import { readFileSync } from 'fs'
import { resolve, sep } from 'path'
import { Registry } from '../registry/Registry'
import { Logger } from '../util/Logger'
import { LanguageModule } from './LanguageModule'
const DEFAULT_LANG = 'en-US'

export class I18NRegistry extends Registry {
  constructor(path = resolve('src', 'locales')) {
    super({ path, autoReload: process.env.ENABLE_REGISTRY_RELOAD || !process.env.PRODUCTION })
    this._defaultLang = null
    this.loadAll(this.path)
  }

  registerLanguage(language, path) {
    const existing = this.modules.find(m => m.language === language)
    if (existing) {
      return existing
    }
    const newLanguage = new LanguageModule(path, language)
    this.modules.push(newLanguage)
    return newLanguage
  }

  loadAll(...args) {
    super.loadAll(...args)
  }

  loadModule(path) {
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const data = JSON.parse(readFileSync(path))

      const [, language, namespace] = path.replace(this.path, '').split(sep)
      const module = this.registerLanguage(language, resolve(this.path, path))

      module.loadNamespace(namespace.replace('.json', ''), data)

      this.emit('load', module)
      return true
    } catch (e) {
      Logger.error(`Error loading ${path}: ${e.stack}`)
      return false
    }
  }

  _locale(languageModule, key, placeholders) {
    if (!languageModule || !Object.prototype.hasOwnProperty.call(languageModule.translations, key)) {
      return
    }

    return I18NRegistry.interpolation(languageModule.translations[typeof key === 'string' ? key : ''], placeholders)
  }

  get defaultLanguage() {
    if (!this._defaultLang) {
      this._defaultLang = this.modules.find(m => m.language === DEFAULT_LANG)
    }
    return this._defaultLang
  }

  getT(language) {
    return (key, placeholders) => {
      const languageModule = this.modules.find(m => m.language === language) || this.defaultLanguage
      return this._locale(languageModule, key, placeholders) || this._locale(this.defaultLanguage, key, placeholders) || key
    }
  }

  static interpolation(str, placeholders) {
    let parsed = str
    for (const placeholder in placeholders) {
      parsed = parsed.split(`{{${placeholder}}}`).join(placeholders[typeof placeholder === 'string' ? placeholder : ''])
    }
    return parsed
  }
}
