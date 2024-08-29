import { Module } from '../registry/Module'

export class LanguageModule extends Module {
  constructor(path, language) {
    super()
    this.__path = path
    this.language = language
    this.translations = {}
  }

  loadNamespace(namespace, data) {
    this.translations = { ...this.translations, ...LanguageModule.parseObj(namespace + ':', data)[0] }
  }

  static parseObj(name, o) {
    return Object.keys(o).reduce((p, v) => {
      const [currentObj, key] = p
      const seperator = key.endsWith(':') ? '' : '.'
      if (typeof o[typeof v === 'string' ? v : ''] === 'object') {
        const [newObj] = LanguageModule.parseObj(key + seperator + v, o[typeof v === 'string' ? v : ''])

        Object.keys(newObj).forEach(n => {
          currentObj[typeof n === 'string' ? n : ''] = newObj[typeof n === 'string' ? n : '']
        })

        return [currentObj, key]
      }

      return [{ ...currentObj, [key + seperator + v]: o[typeof v === 'string' ? v : ''] }, key]
    }, [{}, name])
  }
}

