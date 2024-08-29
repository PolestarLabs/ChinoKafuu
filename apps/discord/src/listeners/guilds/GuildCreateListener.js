import { Listener } from '../../structures/events/Listener'
import { BlacklistUtils, EmbedBuilder, TopGGUtils } from '../../structures/util'

export default class GuildCreateListener extends Listener {
  constructor() {
    super()
    this.event = 'guildCreate'
  }

  async on(client, guild) {
    client.database.guilds.getOrCreate(guild.id, {
      lang: guild.preferredLocale
    })

    const top_gg = new TopGGUtils()
    await top_gg.post(client)
    const blacklist = new BlacklistUtils(client)
    if (!process.env.JOIN_AND_LEAVE_GUILD_CHANNEL_LOG) return
    client.getRESTChannel(process.env.JOIN_AND_LEAVE_GUILD_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Megumi Natsu' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Megumi Natsu',
          options: {
            type: 1
          }
        })
      }

      const owner = await client.getRESTUser(guild.ownerID)
      if (await blacklist.verifyGuild(guild)) {
        const embed = new EmbedBuilder()
        embed.setColor('#730101')
        embed.setTitle('Guild Blacklisted')
        embed.setDescription(`Someone tried to add me on this guild, but the guild is on my blacklist\n**Name:** ${guild.name} (\`${guild.id}\`)\n**Owner:** @${owner.username}`)
        embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
        embed.setTimestamp()

        client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874330667209609226/298498.png',
          username: 'Megumi Natsu'
        })

        guild.leave()
        return
      }

      const embed = new EmbedBuilder()
      embed.setColor('#187000')
      embed.setTitle('Guild Joined')
      embed.setDescription(`**Name:** ${guild.name} (\`${guild.id}\`)\n**Owner:** @${owner.username}\n**Members:** ${guild.memberCount}`)
      embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
      embed.setTimestamp()

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874330667209609226/298498.png',
        username: 'Megumi Natsu'
      })
    })
  }
}
