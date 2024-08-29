import EventEmitter from 'events'
import { Logger } from '../../../structures/util/Logger'
import { PluginExtend } from './loaders/PluginExtend'

export class PluginManager extends EventEmitter {

  // This class will be used to remove some interfaces from the Eris Context to avoid reconnection explosions.

  // @Thread
  // Soon I will add Worker Thread support to split processes to have control of these processes between.
  //
  constructor() {
    super()
    this.pluginStore = new Map()
    this.plugins = []
  }

  addPlugins(...plugins) {
    this.plugins = plugins
    this.startPlugin()
  }

  startPlugin() {

    if ((this.plugins.length === 0)) return

    const plugin = this.plugins[0]
    if (plugin instanceof PluginExtend) {
      try {
        plugin.$pluginManager = this
        plugin.once('started', ({ time, classState }) => {
          this.pluginStore.set(plugin.name, plugin)
          Logger.info(`${classState.name} - Plugin started successfully! (${time - classState.started}ms)`)
          if (!(this.plugins.length === 0)) {
            this.startPlugin()
          }
        }) // eslint-disable-next-line no-unused-vars
          .once('failed', ({ started, loaded, classState, time, error }) => {

            if (!(this.plugins.length === 0)) {
              this.startPlugin()
            }
            Logger.error(error)
          })
          .once('discarded', () => {
            if (!(this.plugins.length === 0)) {
              this.startPlugin()
            }
            plugin.inactive = true
          })
        this.plugins.shift()
        plugin.start({
          options: {},
          env: process.env,
          pluginManager: this,
          $worker: null,
        })

      } catch (err) {
        plugin.logger.error(err)
      }
    }
  }
}