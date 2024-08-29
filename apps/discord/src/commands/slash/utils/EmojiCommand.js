import axios from 'axios'
import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class EmojiCommand extends Command {
  constructor() {
    super({
      name: 'emoji',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('emoji')
        .setDescription('Get the emoji attachment.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('emoji')
            .setDescription('Mention an emoji')
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
    const emoji = await ctx.getEmoji(ctx.args.get('emoji')?.value)
    if (!emoji) return ctx.replyT('error', 'basic:invalidEmoji')

    const buffer = await axios.get(emoji.url, { responseType: 'arraybuffer' }).then(d => d.data)
    ctx.send('', {
      file:
      {
        file: buffer,
        name: `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`
      }
    })
  }
}
