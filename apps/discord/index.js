/* eslint-disable jest/require-hook */
import dotenv from 'dotenv'
import { APIProcess } from './src/structures/Process'
import { BUILD_INFO } from './src/structures/util/Constants'
import { Logger } from './src/structures/util/index'
import { PluginManager } from './src/structures/util/plugins/PluginManager'
import { CacheProfile } from './src/structures/util/plugins/cache/CacheProfile'
import { BotStore } from './src/structures/util/plugins/store/BotStore'
import { BuildStore } from './src/structures/util/plugins/store/BuildStore'
import { DatabaseStore } from './src/structures/util/plugins/store/DatabaseStore'

// Load packages global!
await import('./src/tools/JSONTools')
await import('./src/tools/Exception')
await import('./src/tools/StringBuilder')

dotenv.config({
  path: '../../.env'
})

APIProcess()

BUILD_INFO.commit_log()

class StateApplication {
  constructor(state) {
    this.state = state ?? {}

  }

  // Start ChinoKafuu/Discord
  start() {
    const pluginManager = new PluginManager()

    pluginManager.addPlugins(
      new CacheProfile(),
      new BuildStore(),
      new DatabaseStore(),
      new BotStore()
    )

    process.on('warning', (warn) => {
      return Logger.warning(warn.debug().removePath())
    })
    process.on('uncaughtExceptionMonitor', (err) => {
      return Logger.error(err.debug().removePath())
    })
    process.on('uncaughtException', (err) => {
      return Logger.error(err.debug().removePath())
    })
  }
}

new StateApplication().start()