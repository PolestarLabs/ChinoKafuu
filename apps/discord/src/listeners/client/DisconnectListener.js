import { Listener } from '../../structures/events/Listener'
import { Logger } from '../../structures/util/Logger'

export default class DisconnectListener extends Listener {
  constructor() {
    super()
    this.event = 'disconnect'
  }

  // eslint-disable-next-line no-unused-vars
  async on(client) {
    client.connect = false
    Logger.shardMessage('Mayday! All shard has died!')
  }
}
