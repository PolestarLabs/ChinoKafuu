import { CommandBase, CommandOptions } from 'eris'
import { UsagiAPI } from 'usagiapi'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
const usagi = new UsagiAPI()

export default class DanceCommand extends Command {
  constructor() {
    super({
      name: 'dance',
      aliases: ['dançar', 'danca'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('dance')
        .setDescription('Calls a user dance')
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
    const image = await usagi.get({ endpoint: 'dance' })
    const embed = new EmbedBuilder()
    embed.setColor('ACTION')
    embed.setImage(image)
    embed.setDescription(ctx._locale('commands:dance.danced', { 0: ctx.message.member.mention, 1: member.mention }))
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
