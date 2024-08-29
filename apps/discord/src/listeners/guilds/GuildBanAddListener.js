import { Listener } from '../../structures/events/Listener'
import { EmbedBuilder } from '../../structures/util'

export default class GuildBanAddListener extends Listener {
  constructor() {
    super()
    this.event = 'guildBanAdd'
  }

  async on(client, guild, member) {
    try {
      const server = await client.database.guilds.getOrCreate(guild.id)
      const _locale = client.i18nRegistry.getT(server.lang)
      if (!guild.members.get(client.user.id).permissions.has('viewAuditLog')) return
      const audit = await guild.getAuditLogs()
      const guildBanAdd = audit.entries.filter(action => action.actionType === 22)
      if (guildBanAdd[0].user.id === client.user.id) return
      const mod = guildBanAdd[0].user
      const reason = guildBanAdd[0].reason ?? _locale('basic:noReason')
      const embed = new EmbedBuilder()
      embed.setColor('MODERATION')
      embed.setThumbnail(member.avatarURL)
      embed.setTitle(_locale('basic:punishment.banned', { 0: `@${member.username}` }))
      embed.addField(_locale('basic:punishment.embed.memberName'), `@${member.username} (\`${member.id}\`)`)
      embed.addField(_locale('basic:punishment.embed.staffName'), `@${mod.username} (\`${mod.id}\`)`)
      embed.addField(_locale('basic:punishment.embed.reason'), reason)

      if (!server.punishModule) return
      const channel = guild.channels.get(server.punishChannel)
      if (!channel) {
        server.punishModule = false
        server.punishChannel = ''
        server.save()
        return
      }

      channel.createMessage(embed.build())
    } catch (err) {
      const server = await client.database.guilds.getOrCreate(guild.id)
      const _locale = client.i18nRegistry.getT(server.lang)
      const reason = _locale('basic:noReason')
      const embed = new EmbedBuilder()
      embed.setColor('MODERATION')
      embed.setThumbnail(member.avatarURL)
      embed.setTitle(_locale('basic:punishment.banned', { 0: `@${member.username}` }))
      embed.addField(_locale('basic:punishment.embed.memberName'), `@${member.username} (\`${member.id}\`)`)
      embed.addField(_locale('basic:punishment.embed.reason'), reason)

      if (!server.punishModule) return
      const channel = guild.channels.get(server.punishChannel)
      if (!channel) {
        server.punishModule = false
        server.punishChannel = ''
        server.save()
        return
      }

      channel.createMessage(embed.build())
    }
  }
}
