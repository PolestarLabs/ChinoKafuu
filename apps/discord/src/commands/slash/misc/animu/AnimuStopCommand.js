import { Command, SlashCommandContext } from '../../../../structures/util'

export default class AnimuStopCommand extends Command {
  constructor() {
    super({
      name: 'animu leave',
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
  async run(ctx) {
    ctx.client.playerManager.getPlayer(ctx.message.guild.id).delete()
    ctx.replyT('success', 'commands:animu.leaving')
  }
}
