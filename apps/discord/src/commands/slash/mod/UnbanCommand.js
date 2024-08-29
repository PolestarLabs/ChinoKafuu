import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class UnbanCommand extends Command {
  constructor() {
    super({
      name: 'unban',
      aliases: ['desbanir'],
      permissions: [{
        entity: 'bot',
        permissions: ['banMembers', 'embedLinks']
      },
      {
        entity: 'user',
        permissions: ['banMembers']
      }],
      slash: new CommandBase()
        .setName('unban')
        .setDescription('Unbans a user if they\'re banned.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('ID of the banned user.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('reason')
            .setDescription('Inform reason')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const guild = ctx.message.guild
    const bans = await guild.getBans()
    const member = bans.find(ban => ban.user.id === ctx.args.get('user').value)
    if (!member) return ctx.replyT('error', 'commands:unban.notBanned')
    const reason = ctx.args.get('reason')?.value ?? ctx._locale('basic:noReason')

    guild.unbanMember(member.user.id, ctx._locale('basic:punishment.reason', { 0: `@${ctx.message.author.username}`, 1: reason })).then(() => {
      const embed = new EmbedBuilder()
      embed.setColor('MODERATION')
      embed.setThumbnail(member.user.avatarURL)
      embed.setTitle(ctx._locale('basic:punishment.unbanned', { 0: `@${member.user.username}` }))
      embed.addField(ctx._locale('basic:punishment.embed.memberName'), `@${member.user.username} (\`${member.user.id}\`)`)
      embed.addField(ctx._locale('basic:punishment.embed.staffName'), `@${ctx.message.author.username} (\`${ctx.message.author.id}\`)`)
      embed.addField(ctx._locale('basic:punishment.embed.reason'), reason)

      ctx.send(embed.build())

      const server = ctx.db.guild
      if (server.punishModule) {
        const channel = ctx.message.guild.channels.get(server.punishChannel)
        if (!channel) {
          server.punishModule = false
          server.punishChannel = ''
          server.save()
          return ctx.replyT('error', 'events:channel-not-found')
        }

        channel.createMessage(embed.build())
      }
    })
  }
}
