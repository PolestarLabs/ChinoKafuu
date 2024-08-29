import { CommandRunner } from '../../structures/command/CommandRunner'
import { Listener } from '../../structures/events/Listener'

export default class MessageUpdateListener extends Listener {
  constructor() {
    super()

    this.event = 'messageUpdate'
  }

  async on(client, newMsg, oldMsg) {
    if (newMsg?.content === oldMsg?.content) return
    await CommandRunner.run(client, newMsg)
  }
}
