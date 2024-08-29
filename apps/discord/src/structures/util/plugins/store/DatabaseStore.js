import { Database } from '../../../../structures/database/Database'
import { PluginExtend } from '../loaders/PluginExtend'

export class DatabaseStore extends PluginExtend {
  constructor() {
    super({
      name: 'mongodb',
      args: {},
      timeout: 23 * 1000
    })

  }

  start() {
    try {
      const state = new Database()
      state.on('state', (a) => {
        if (a) {
          this.$addClassState({ data: state })
          this.ready()
        } else {
          this.fail(Error('Unable to connect to the database'))
        }
      })

    } catch (err) {
      this.fail(err)
    }
  }
}
