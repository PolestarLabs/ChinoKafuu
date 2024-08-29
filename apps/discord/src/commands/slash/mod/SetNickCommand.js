import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class SetNickCommand extends Command {
  constructor() {
    super({
      name: 'setnick',
      aliases: ['changenick', 'updatenick', 'alterarnickname', 'setnickname'],
      permissions: [{
        entity: 'both',
        permissions: ['manageNicknames']
      }],
      slash: new CommandBase()
        .setName('setnick')
        .setDescription('Sets the nickname of a member')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention member on server.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('nickname')
            .setDescription('Add a new nickname.')
            .isRequired(),
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const member = await ctx.getMember(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    const newNick = ctx.args.get('nickname').value
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    try {
      await member.edit({
        nick: newNick
      })
      return ctx.replyT('success', 'commands:setnick.success', { member: member.username, nickname: newNick })
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      return ctx.replyT('error', 'commands:setnick.error') // FIXME error being triggered with no reason
    }
  }
}
