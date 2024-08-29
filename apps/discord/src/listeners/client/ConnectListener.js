import { Listener } from '../../structures/events/Listener'
import { Logger } from '../../structures/util'

export default class ConnectListener extends Listener {
  constructor() {
    super()
    this.event = 'connect'
  }

  async on(client, shardID) {
    client.shardUptime.set(shardID, {
      shardID,
      uptime: Date.now()
    })

    Logger.shardMessage(`Hurry up! Shard ${shardID} is alive!`)
  }
}
