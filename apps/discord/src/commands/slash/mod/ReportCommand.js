import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class ReportCommand extends Command {
  constructor() {
    super({
      name: 'report',
      aliases: ['reportar'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('report')
        .setDescription('Reports a user on this server if the module is enable.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention member on server.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('reason')
            .setDescription('Inform the reason why to report the user.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('proof')
            .setDescription('The proof of the infraction. (Image\'s URL)')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const server = ctx.db.guild
    if (!server.reportModule) return ctx.replyT('error', 'commands:report.moduleDisable')
    const member = await ctx.getUser(ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const reason = ctx.args.get('reason').value
    if (!reason[0]) return ctx.replyT('error', 'commands:report.noReason')
    const channel = ctx.client.getChannel(server.channelReport)
    const proof = ctx.args.get('proof')?.value
    if (!channel) {
      server.reportModule = false
      server.channelReport = ''
      return ctx.replyT('commands', 'commands:report.channelNotFound')
    }

    const embed = new EmbedBuilder()
    embed.setColor('MODERATION')
    embed.setThumbnail(member.avatarURL)
    embed.addField(ctx._locale('commands:report.embed.memberName'), `@${member.username} (\`${member.id}\`)`)
    embed.addField(ctx._locale('commands:report.embed.authorName'), `@${ctx.message.author.username} (\`${ctx.message.author.id}\`)`)
    embed.addField(ctx._locale('commands:report.embed.channel'), ctx.message.channel.mention)
    embed.addField(ctx._locale('commands:report.embed.reason'), proof ? `[${reason}](${proof})` : reason)

    channel.createMessage(embed.build())
    ctx.replyT('success', 'commands:report.successfullySent')
  }
}
