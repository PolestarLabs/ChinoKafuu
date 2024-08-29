import { CommandBase, CommandOptions } from 'eris'
import { UsagiAPI } from 'usagiapi'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

const usagi = new UsagiAPI()

export default class KissCommand extends Command {
  constructor() {
    super({
      name: 'kiss',
      aliases: ['beijar'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('kiss')
        .setDescription('Kiss your true love (or not).')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
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
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    if (ctx.message.member.id === member.id) return ctx.replyT(':error:', 'commands:kiss.unable')
    const img = await usagi.get({ endpoint: 'kiss' })
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setDescription(ctx._locale('commands:kiss.kissed', { author: ctx.message.member.mention, member: member.mention }))
    embed.setImage(img)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
