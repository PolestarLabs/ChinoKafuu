import { CommandBase, CommandOptions } from 'eris'
import NekosLife from 'nekos.life'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
const NekoClient = new NekosLife()

export default class BakaCommand extends Command {
  constructor() {
    super({
      name: 'baka',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('baka')
        .setDescription('Calls a user baka')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
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
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const image = await NekoClient.baka()
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setDescription(ctx._locale('commands:baka.baka', { author: ctx.message.author.mention, member: member.mention }))
    embed.setImage(image.url)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
