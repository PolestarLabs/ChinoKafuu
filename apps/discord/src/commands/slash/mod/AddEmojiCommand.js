import axios from 'axios'
import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class AddEmojiCommand extends Command {
  constructor() {
    super({
      name: 'addemoji',
      aliases: ['adicionaremoji'],
      permissions: [{
        entity: 'both',
        permissions: ['manageEmojisAndStickers']
      }],
      slash: new CommandBase()
        .setName('addemoji')
        .setDescription('Creates an new emoji to your guild.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('name')
            .setDescription('The way that you want to name the emoji.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('source')
            .setDescription('The source of the new emoji (URL or other emoji).')
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
    const name = ctx.args.get('name').value
    let source = ctx.args.get('source').value

    try {
      const get_emoji = await ctx.getEmoji(source)
      if (get_emoji) {
        source = get_emoji?.url
      }

      const buffer = await axios.get(source, { responseType: 'arraybuffer' }).then(d => Buffer.from(d.data, 'binary').toString('base64'))
      const image = `data:image/${source.substr(source.length - 3)};base64,${buffer}`
      const emoji = await ctx.message.guild.createEmoji({
        name,
        image
      })
      ctx.send(`<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}> **|** ${ctx.message.author.mention}, ${ctx._locale('commands:addemoji.added')}`)
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      return ctx.replyT('error', 'commands:addemoji.error')
    }
  }
}
