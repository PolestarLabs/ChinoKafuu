import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
import { UsagiAPI } from 'usagiapi'
import { CommandBase, CommandOptions } from 'eris'
const usagi = new UsagiAPI()

export default class PatCommand extends Command {
  constructor() {
    super({
      name: 'pat',
      aliases: ['cafune', 'cafuné'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('pat')
        .setDescription('Pat, pat, pat me, please! Give a pat to your friend.')
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
    const img = await usagi.get({ endpoint: 'pat' })
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setDescription(ctx._locale('commands:pat.pated', { 0: ctx.message.member.mention, 1: member.mention }))
    embed.setImage(img)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
