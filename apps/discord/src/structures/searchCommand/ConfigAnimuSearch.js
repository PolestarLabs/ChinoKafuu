import { Interaction } from 'eris'
import { ResultsMechanism } from '../util/ResultsMechanism'

export const ConfigAnimuSearch =  {
  CONFIG_ANIMU_SEARCH: 'config animu',
  searchClass: class {
    constructor() { }

    static search(interaction = new Interaction()) {
      const guild = new ResultsMechanism()

      try {
        guild.searchVoiceChannel_Interaction(interaction.command.interface.get('channel').value, interaction)
      } catch (e) {
        console.log(e)
      }
    }
  }
}