import { Command, SlashCommandContext } from '../../../structures/util'
import { CommandOptions, CommandBase } from 'eris'

export default class RepCommand extends Command {
  constructor() {
    super({
      name: 'rep',
      aliases: ['reputation', 'reputação', 'reputacao'],
      slash: new CommandBase()
        .setName('rep')
        .setDescription('Gives a reputation to someone.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention member on server.')
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
    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const author = ctx.db.user
    const receiver = await ctx.client.database.users.getOrCreate(member.id)
    if (member.id === ctx.message.author.id) return ctx.replyT('error', 'commands:rep.cannotGiveRepForYourself')
    if (member.id === ctx.client.user.id) {
      author.repTime = 3600000 + Date.now()
      receiver.rep += 1
      receiver.save().then(() => {
        ctx.replyT('chino_maid', 'commands:rep.forTheClient', { 0: receiver.rep })
      })
      author.save()
      return
    }
    if (parseInt(author.repTime) < Date.now()) {
      author.repTime = 3600000 + Date.now()
      receiver.rep += 1
      author.save()
      receiver.save().then(() => {
        ctx.replyT('success', 'commands:rep.successffully', { 0: member.mention, 1: receiver.rep })
      })
    } else {
      ctx.replyT('warn', 'commands:rep.cooldown', { 0: `<:t${parseInt(author.repTime).toFixed(0)}:R>` })
    }
  }
}
