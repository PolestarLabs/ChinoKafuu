import { CommandBase, CommandOptions } from 'eris'
import { requestTokamak } from '../../../lib'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class RizeCommand extends Command {
  constructor() {
    super({
      name: 'rize',
      aliases: ['rizesign'],
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('rize')
        .setDescription('Makes Rize writes on the paper')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Enter random text')
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
    const render = await requestTokamak({
      action: 'renderRize',
      rizeStruct: {
        text: ctx.args.get('text').value
      }
    })

    ctx.send('', { file: { file: render.buffer, name: 'rize.png' } })
  }
}
