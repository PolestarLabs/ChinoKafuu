import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class SlowmodeCommand extends Command {
  constructor() {
    super({
      name: 'slowmode',
      aliases: ['modolento'],
      permissions: [{
        entity: 'both',
        permissions: ['manageChannels']
      }],
      slash: new CommandBase()
        .setName('slowmode')
        .setDescription('Set slowmode in the current channel.')
        .addOptions(
          new CommandOptions()
            .setType(4)
            .setName('time')
            .setDescription('Set slowmode in the current channel.')
            .isRequired(),
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  run(ctx) {
    const time = Math.round(ctx.args.get('time').value)
    if (time > 600) return ctx.replyT('error', 'commands:slowmode.rateLimited')
    if (time < 0) return ctx.replyT('error', 'commands:slowmode.minimalTimeLimited')
    if (time <= 0) {
      ctx.message.channel.edit({
        rateLimitPerUser: time
      }).then(() => {
        ctx.replyT('success', 'commands:slowmode.rateLimitDisable', { 0: ctx.message.channel.mention })
      })
    } else {
      ctx.message.channel.edit({
        rateLimitPerUser: time
      }).then(() => {
        ctx.replyT('success', 'commands:slowmode.rateLimitEnable', { 0: ctx.message.channel.mention, 1: time })
      })
    }
  }
}
