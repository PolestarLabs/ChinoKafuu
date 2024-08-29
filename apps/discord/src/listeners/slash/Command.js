import { Interaction } from 'eris'
import { SlashRunner } from '../../structures/command/SlashRunner'
import { Listener } from '../../structures/events/Listener'

export default class Command extends Listener {
  constructor() {
    super()
    this.event = 'interactionCreate'
    this.loadStarted = false
  }

  async on(client, interaction = new Interaction()) {
    if (interaction.type === 2) {
      await SlashRunner.run(client, interaction)
    }
  }
}
