
import { Listener } from '../../structures/events/Listener'
import { ConfigAnimuSearch } from '../../structures/searchCommand/ConfigAnimuSearch'
import { ConfigModSearch } from '../../structures/searchCommand/ConfigModSearch'
import { ConfigReportSearch } from '../../structures/searchCommand/ConfigReportSearch'

export default class AutoCompleteListener extends Listener {
  constructor() {
    super()

    this.event = 'interactionCreate'
  }

  async on(client, interaction) {
    const command = client.slashCommandRegistry.findByName(interaction.command.commandName)
    if (!command) return

    if (interaction.type === 8 || interaction.type === 4) {
      switch (interaction.command.commandName) {
        case ConfigAnimuSearch.CONFIG_ANIMU_SEARCH: {
          ConfigAnimuSearch.searchClass.search(interaction)
        }
          break
        case ConfigModSearch.CONFIG_MOD_SEARCH: {
          ConfigModSearch.searchClass.search(interaction)
        }
          break
        case ConfigReportSearch.CONFIG_REPORT_SEARCH: {
          ConfigReportSearch.searchClass.search(interaction)
        }
          break
      }
    }
  }
}
