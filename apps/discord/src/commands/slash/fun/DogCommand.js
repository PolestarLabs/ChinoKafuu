import { CommandBase } from 'eris'
import NekosLife from 'nekos.life'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
const NekoClient = new NekosLife()

export default class DogCommand extends Command {
  constructor() {
    super({
      name: 'dog',
      aliases: ['cachorro'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('dog')
        .setDescription('Sends an image or gif of a dog')
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    const image = await NekoClient.woof()
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setImage(image.url)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
