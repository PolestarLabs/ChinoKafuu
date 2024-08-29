import { Listener } from '../../structures/events/Listener'
import { BlacklistUtils, EmbedBuilder, TopGGUtils } from '../../structures/util'

export default class GuildDeleteListener extends Listener {
  constructor() {
    super()
    this.event = 'guildDelete'
  }

  async on(client, guild) {
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
        embed.setDescription(`I quited of this guild because it is in my blacklist\n**Name:** ${guild.name} (\`${guild.id}\`)\n**Owner:** @${owner.username}`)
        embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
        embed.setTimestamp()

        client.executeWebhook(webhook.id, webhook.token, {
          embeds: [embed],
          avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874330667209609226/298498.png',
          username: 'Megumi Natsu'
        })
        return
      }

      const embed = new EmbedBuilder()
      embed.setColor('#eb2323')
      embed.setTitle('Guild Deleted')
      embed.setDescription(`**Name:** ${guild.name} (\`${guild.id}\`)\n**Owner:** @${owner.username}`)
      embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
      embed.setTimestamp()

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874330667209609226/298498.png',
        username: 'Megumi Natsu'
      })

      client.database.guilds.getAndDelete(guild.id)
    })
  }
}
