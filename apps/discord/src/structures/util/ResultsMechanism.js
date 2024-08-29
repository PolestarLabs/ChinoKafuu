import { Constants } from 'eris'

const resolveMatch = (text = '', textVerify = '') => {
  const input = typeof text !== 'string' ? '' : text.toLocaleLowerCase()
  const inputVerify = typeof textVerify !== 'string' ? '' : textVerify.toLocaleLowerCase()

  return inputVerify.includes(input)
}

export class ResultsMechanism {
  searchChannel_Interaction(search, interaction) {
    const channels = interaction.channel.guild.channels
      .filter((e) => e.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) || e.id === search)
      .map((i) => {
        return {
          type: 3,
          name: `${i.name} - ${i.id}`,
          value: i.id
        }
      })

    if (channels.size === 0) {
      interaction.autoComplete.addOptions().callback()
    } else {
      interaction.autoComplete.addOptions(channels).callback()
    }
  }

  searchTextChannel_Interaction(search, interaction) {
    const channels = interaction.channel.guild.channels
      .filter((e) => e.type === Constants.ChannelTypes.GUILD_TEXT)
      .filter((e) => resolveMatch(search, e.name) || e.id === search)
      .map((i) => {
        return {
          type: 3,
          name: `${i.name} - ${i.id}`,
          value: i.id
        }
      })

    if (channels.size === 0) {
      interaction.autoComplete.addOptions().callback()
    } else {
      interaction.autoComplete.addOptions(channels).callback()
    }
  }

  searchVoiceChannel_Interaction(search, interaction) {

    const channels = interaction.channel.guild.channels
      .filter((e) => e.type === Constants.ChannelTypes.GUILD_VOICE)
      .filter((e) => resolveMatch(search, e.name) || e.id === search)
      .map((i) => {
        return {
          type: 3,
          name: `${i.name} - ${i.id}`,
          value: i.id
        }
      })

    if (channels.size === 0) {
      interaction.autoComplete.addOptions().callback()
    } else {
      interaction.autoComplete.addOptions(channels).callback()
    }
  }
}