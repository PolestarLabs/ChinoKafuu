import { Listener } from '../../structures/events/Listener'
import { addLocaleInCommands } from '../../structures/interactionTranslation'

export default class SlashCommand extends Listener {
  constructor() {
    super()
    this.event = 'ready'
    this.loadStarted = false
  }

  async on(client) {
    if (this.loadStarted === false) {
      this.loadStarted = true
      const commandFolder = []
      for (const command of client.slashCommandRegistry.modules) {
        if (process.env.PRODUCTION === 'false') {
          if (!command.isBeta) {
            if (!(command.slash === null)) {
              commandFolder.push(command.slash)
            }
          }
        } else {
          if (!(command.slash === null)) {
            commandFolder.push(command.slash)
          }
        }

      }

      await addLocaleInCommands(commandFolder, client)

      // commandRegistry:

      // This is for production testing.
      // client.slashCommand.addVolumeOfCommands(commandFolder)
      // Remembering that you have to remove the bot
      // from the server and add it again to update the commands quickly.

      // client.slashCommand.createCommand(commandFolder)

      await client.addVolumeOfCommands(commandFolder, client.user.id)
    }
  }
}
