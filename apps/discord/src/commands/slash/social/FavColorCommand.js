import { Command, SlashCommandContext } from '../../../structures/util'
import { CommandBase, CommandOptions } from 'eris'

export default class FavColorCommand extends Command {
  constructor() {
    super({
      name: 'favcolor',
      aliases: ['favoritecolor', 'corfavorita'],
      slash: new CommandBase()
        .setName('favcolor')
        .setDescription('Changes your profile color to your favorite color.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('color')
            .setDescription('For example: #f55f96')
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
    if (ctx.db.user.yens < 150) return ctx.replyT('error', 'commands:favcolor.poorUser', { 0: ctx.db.user.yens - 75 })
    const color = ctx.args.get('color').value
    if (!color.startsWith('#')) return ctx.replyT('error', 'commands:favcolor.invalidColor')

    ctx.db.user.profileColor = color
    ctx.db.user.yens -= 150
    ctx.db.user.save().then(() => {
      ctx.replyT('success', 'commands:favcolor.successfullyChanged')
    })
  }
}
