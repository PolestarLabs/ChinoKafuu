import { Listener } from '../../structures/events/Listener'
import SlashCommandManager from '../../structures/SlashCommandManager'

export default class ReadyListener extends Listener {
  constructor() {
    super()
    this.send = false
    this.event = 'ready'
  }

  async on(client) {
    if (!this.send) {

      client.emit('readyConnection', client)
      const manager = new SlashCommandManager(client)
      client.playerManager.connectNode()
      client.commands = await manager.fetchCommands()
    }
  }
}
