import { CommandRunner } from '../../structures/command/CommandRunner'
import { Listener } from '../../structures/events/Listener'

export default class MessageCreateListener extends Listener {
  constructor() {
    super()

    this.event = 'messageCreate'
  }

  async on(client, msg) {
    await CommandRunner.run(client, msg)
  }
}
