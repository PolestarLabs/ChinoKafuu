import { Command, SlashCommandContext } from '../../../../structures/util'

export default class AnimuVolumeCommand extends Command {
  constructor() {
    super({
      name: 'animu volume',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  run(ctx) {
    if (!ctx.client.playerManager.isAvailable) return ctx.replyT('error', 'commands:animu.unavailable')
    if (!ctx.message.guild.members.get(ctx.client.user.id).voiceState.channelID) return ctx.replyT('error', 'baisc:voice.clientAreNotInVoiceChannel')
    if (!ctx.client.playerManager.getPlayer(ctx.message.guild.id).player.playingTrack) return ctx.replyT('error', 'basic:voice.playerNotFound')
    if (parseInt(ctx.args.get('value').value) > 100) return ctx.replyT('error', 'basic:voice.maxVolume')
    if (parseInt(ctx.args.get('value').value) < 5) return ctx.replyT('error', 'basic:voice.minVolume')
    ctx.client.playerManager.getPlayer(ctx.message.guild.id).setVolume(ctx.args.get('value').value, 100)
    ctx.replyT('success', 'commands:animu.volumeChanged')
  }
}
