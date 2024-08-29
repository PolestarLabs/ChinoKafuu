import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class KickCommand extends Command {
  constructor() {
    super({
      name: 'kick',
      aliases: ['expulsar'],
      permissions: [{
        entity: 'user',
        permissions: ['kickMembers']
      }, {
        entity: 'bot',
        permissions: ['kickMembers', 'embedLinks']
      }],
      slash: new CommandBase()
        .setName('kick')
        .setDescription('Kicks an user in the guild')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('To kick user.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('reason')
            .setDescription('Reason fo the punishment')
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

    const reason = ctx.args.get('reason')?.value ?? ctx._locale('basic:noReason')
    if (reason.trim().length > 512) return ctx.reply('error', 'basic:punishment.bigReason')
    if (member.id === ctx.message.member.id) return ctx.replyT('error', 'basic:punishment.selfPunishment')
    if (member.id === ctx.message.guild.ownerID) return ctx.replyT('error', 'basic:punishment.ownerPunish')

    const guildMember = await ctx.getMember(member.id)
    if (!guildMember) return ctx.replyT('error', 'basic:invalidUser')
    try {
      const embed = new EmbedBuilder()
      embed.setTitle(ctx._locale('basic:punishment.kicked', { 0: `@${member.username}` }))
      embed.setColor('MODERATION')
      embed.setThumbnail(member.avatarURL)
      embed.addField(ctx._locale('basic:punishment.embed.memberName'), `@${guildMember.user.username} (\`${guildMember.user.id}\`)`)
      embed.addField(ctx._locale('basic:punishment.embed.staffName'), `@${ctx.message.author.username} (\`${ctx.message.author.id}\`)`)
      embed.addField(ctx._locale('basic:punishment.embed.reason'), reason)
      guildMember.kick(reason).then(() => ctx.send(embed.build()))

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
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      return ctx.replyT('error', 'basic:punishment.error')
    }
  }
}
