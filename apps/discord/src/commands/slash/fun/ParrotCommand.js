import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class ParrotCommand extends Command {
  constructor() {
    super({
      name: 'congaparrot',
      permissions: [{
        entity: 'bot',
        permissions: ['useExternalEmojis']
      }],
      slash: new CommandBase()
        .setName('congaparrot')
        .setDescription('Sends funny parrots')
        .addOptions(
          new CommandOptions()
            .setType(4)
            .setName('quantity')
            .setDescription('Quantity of parrots.')
            .isRequired()
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
    if (quantity > 20) return ctx.replyT('error', ctx._locale('commands:congaparrot.maxAllowed'))
    ctx.send('<a:parrot_dance:554489834417291285>'.repeat(quantity))
  }
}
