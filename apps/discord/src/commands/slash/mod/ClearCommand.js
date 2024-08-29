import { CommandBase, CommandOptions } from 'eris'
import { Command, Emoji, SlashCommandContext } from '../../../structures/util'

export default class ClearCommand extends Command {
  constructor() {
    super({
      name: 'clear',
      aliases: ['limpar'],
      permissions: [{
        entity: 'both',
        permissions: ['manageMessages', 'readMessageHistory', 'viewChannel']
      }],
      slash: new CommandBase()
        .setName('clear')
        .setDescription('Clears messages in this channel. If specified a user, it clears messages from that user')
        .addOptions(
          new CommandOptions()
            .setType(4)
            .setName('quantity')
            .setDescription('Amount of message to delete.')
            .isRequired(),
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const quantity = ctx.args.get('quantity').value
    if (quantity > 100) return ctx.replyT('error', 'commands:clear.limit')
    if (isNaN(quantity)) return ctx.replyT('error', 'commands:clear.nan')
    const user = await ctx.getUser(ctx.args.get('user')?.value)

    if (user !== undefined && user === null) return ctx.replyT('error', 'commands:clear.userNotFound')
    const filter = ((msg) => msg.author.id === user?.id)
    ctx.message.channel.purge(Number(quantity), filter).then((msg) => {
      ctx.message.channel.createMessage(`${Emoji.getEmoji('success').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:clear.success', { messages: msg })}`)
    })
  }
}
