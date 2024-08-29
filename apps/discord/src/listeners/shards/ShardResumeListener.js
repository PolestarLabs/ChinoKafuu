import { Listener } from '../../structures/events/Listener'
import { EmbedBuilder, Logger } from '../../structures/util'

export default class ShardResumeListener extends Listener {
  constructor() {
    super()
    this.event = 'shardResume'
  }

  async on(client, shardID) {
    if (!process.env.SHARD_CHANNEL_LOG) return
    client.getRESTChannel(process.env.SHARD_CHANNEL_LOG).then(async (channel) => {
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Syaro Kirima' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Syaro Kirima',
          options: {
            type: 1
          }
        })
      }

      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle('Shard Resumed')
      embed.setDescription(`Cluster: #${process.env.CLUSTER_ID ?? '0'} = Shard: ${shardID} => \`Resumed\``)
      embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
      embed.setTimestamp()

      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://cdn.discordapp.com/attachments/699339406657585363/1031243956895350904/20221016_133420.jpg',
        username: 'Syaro Kirima'
      })
    })

    Logger.shardMessage(`Let's go! Shard ${shardID} has been resumed!`)
  }
}
