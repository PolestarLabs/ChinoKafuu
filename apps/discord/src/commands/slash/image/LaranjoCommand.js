import { CommandBase, CommandOptions } from 'eris'
import { requestTokamak } from '../../../lib'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class LaranjoCommand extends Command {
  constructor() {
    super({
      name: 'laranjo',
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('laranjo')
        .setDescription('Laranjo will say something silly.')
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
      action: 'renderLaranjo',
      laranjoStruct: {
        text: ctx.args.get('text').value
      }
    })

    ctx.send('', { file: { file: render.buffer, name: 'laranjo.png' } })
  }
}
