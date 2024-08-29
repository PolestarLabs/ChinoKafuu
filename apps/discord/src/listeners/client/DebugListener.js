import { Listener } from '../../structures/events/Listener'
import { Logger } from '../../structures/util/Logger'

export default class DebugListener extends Listener {
  constructor() {
    super()
    this.event = 'debug'
  }

  async on(client, message) {
    if (process.env.PRODUCTION === 'false') {
      Logger.debug(message)
    }
  }
}
