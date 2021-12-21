const { Command, EmbedBuilder } = require('../../../utils')
const { CommandBase, CommandOptions } = require('eris')
const ms = require('ms')
module.exports = class MuteCommand extends Command {
  constructor() {
    super({
      name: 'mute',
      aliases: [],
      arguments: 1,
      hasUsage: true,
      permissions: [{
        entity: 'both',
        permissions: ['moderateMembers']
      }],
      slash: new CommandBase()
        .setName('mute')
        .setDescription('Mutes a user in the guild')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('To mute the user.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('time')
            .setDescription('The time to mute the user (e.g: 60s, 10m, 1h, 1d, 7d).')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('reason')
            .setDescription('Enter reason to mute the user.')
        )
    })
  }

  async run(ctx) {
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value)
    const guildMember = ctx.message.guild.members.get(member.id)
    const reason = ctx._locale('basic:punishment.reason', {
      0: `${ctx.message.member.user.username}#${ctx.message.member.user.discriminator}`, 1: ctx.args.get('reason') ?
        ctx.args.get('reason').value : ctx._locale('basic:noReason')
    })
    const time = ctx.args.get('time')?.value
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    if (guildMember) {
      if (member.id === ctx.message.member.id) return ctx.replyT('error', 'commands:mute.selfMute')
      if (member.id === ctx.message.guild.ownerID) return ctx.replyT('error', 'commands:mute.ownerMute')
    }
    function timestampConverter(date) {
      let s = new Date(Date.now() + ms(date)).toUTCString()
      s = new Date(s).toISOString()
      return s
    }

    if (reason.trim().length > 512) return ctx.reply('error', 'basic:punishment.bigReason')

    try {
      ctx.client.setGuildMemberTimeout(ctx.message.guild.id, member.id, timestampConverter(time), reason).then(() => {
        const embed = new EmbedBuilder()
        embed.setColor('MODERATION')
        embed.setThumbnail(member.avatarURL)
        embed.setTitle(ctx._locale('basic:punishment.muted', { 0: `${member.username}#${member.discriminator}` }))
        embed.addField(ctx._locale('basic:punishment.embed.memberName'), `${member.username}#${member.discriminator} (\`${member.id}\`)`)
        embed.addField(ctx._locale('basic:punishment.embed.staffName'), `${ctx.message.member.username}#${ctx.message.member.discriminator} (\`${ctx.message.member.id}\`)`)
        embed.addField(ctx._locale('basic:punishment.embed.reason'), ctx.args.get('reason')?.value ?? ctx._locale('basic:noReason'))

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
    } catch {
      await ctx.replyT('error', 'commands:ban.error')
    }
  }
}
