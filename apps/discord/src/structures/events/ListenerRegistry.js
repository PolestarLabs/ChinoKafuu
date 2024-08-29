import { resolve } from 'path'
import { Registry } from '../registry/Registry'
import { Logger } from '../util'
export class ListenerRegistry extends Registry {
  constructor(client, path = resolve('src/listeners')) {

    super({ path, autoReload: process.env.ENABLE_REGISTRY_RELOAD || !process.env.PRODUCTION })

    this.client = client

    this.on('load', (m) => this.onLoad(m))
    this.on('removal', (m) => this.onRemoval(m))
    this.onEvent = (name, ...data) => this.modules.filter((a) => a.event === name).forEach((a) => a.on(this.client, ...data))

    this.loadAll(this.path)
  }

  getOnListener(name) {
    return (...data) => {
      this.modules.filter((a) => a.event === name).forEach((a) => a.on(this.client, ...data))
    }
  }

  onLoad(listener) {
    if (!this.modules.filter((a) => a !== listener && a.event === listener.event)[0]) this.client.on(listener.event, (...data) => this.onEvent(listener.event, ...data))
  }

  onRemoval(listener) {
    Logger.debug(listener.event)
    if (!this.modules.filter((a) => a !== listener && a.event === listener.event)[0]) this.client.off(listener.event, (...data) => this.onEvent(listener.event, ...data))
  }
}
