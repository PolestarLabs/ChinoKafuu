import { CommandBase } from 'eris'
import NekosLife from 'nekos.life'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

const NekoClient = new NekosLife()

export default class CatCommand extends Command {
  constructor() {
    super({
      name: 'cat',
      aliases: ['gato', 'kitty'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('cat')
        .setDescription('Sends an image or gif of a cat')
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    const image = await NekoClient.meow()
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setImage(image.url)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
