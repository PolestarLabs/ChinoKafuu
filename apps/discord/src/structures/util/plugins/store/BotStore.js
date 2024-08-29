import { BotInterface } from '../../../../manager/BotInterface'
import { Manager } from '../../../../sharder/manager/Manager'
import { PluginExtend } from '../loaders/PluginExtend'

export class BotStore extends PluginExtend {
  constructor() {
    super({
      name: 'bot',
      args: {},
      timeout: 50 * 1000,
    })
  }

  start() {
    try {
      if (process.env.CLUSTERS === 'true') {
        const manager = new Manager()
        manager.start()
      } else {
        this.$addClassState({ data: new BotInterface().spawnShards(this) })
      }

      this.ready()
    } catch (err) {
      console.log(err)
      this.fail(err)
    }
  }
}
