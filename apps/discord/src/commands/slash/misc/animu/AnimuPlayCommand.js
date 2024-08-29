import axios from 'axios'
import { Command, SlashCommandContext } from '../../../../structures/util'

export default class AnimuPlayCommand extends Command {
  constructor() {
    super({
      name: 'animu play',
      permissions: [{
        entity: 'bot',
        permissions: ['viewChannel', 'voiceConnect', 'voiceSpeak', 'voiceRequestToSpeak', 'voiceUseVAD']
      }]
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    if (!ctx.client.playerManager.isAvailable) return ctx.replyT('error', 'commands:animu.unavailable')
    if (!ctx.message.member.voiceState.channelID) return ctx.replyT('error', 'basic:voice.authorAreNotInVoiceChannel')
    const player = ctx.client.playerManager.getPlayer(ctx.message.guild.id)
    if (player.player.playingTrack) return ctx.replyT('error', 'basic:voice.playerAlreadyPlaying')
    player.preparePlayer(ctx.message.member.voiceState.channelID)
      .then(async () => {
        const res = await axios.get(process.env.ANIMU_API_URI)
        ctx.replyT('chino_tail', 'commands:animu.newNowPlaying', { 0: res.data.results[0].metadata, 1: res.data.results[0].dj_name })
      })

  }
}
