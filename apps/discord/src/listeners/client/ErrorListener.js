import { Listener } from '../../structures/events/Listener'
import { EmbedBuilder, Logger } from '../../structures/util'

export default class ErrorListener extends Listener {
  constructor() {
    super()
    this.event = 'error'
  }

  // eslint-disable-next-line no-unused-vars
  async on(client, error, shard) {
    console.log(error)
    const _locale = client.i18nRegistry.getT('en-US')
    if (!process.env.ERROR_CHANNEL_LOG) return
    client.getRESTChannel(process.env.ERROR_CHANNEL_LOG).then(async (channel) => {
      const uselessErros = [
        'WebSocket was closed before the connection was established',
        'Connection reset by peer'
      ]
      if (uselessErros.includes(error.message)) return
      if (!channel) return
      const webhooks = await channel.getWebhooks()
      let webhook = webhooks.filter((w) => w.name === 'Chiya Ujimatsu' && w.user.id === client.user.id)[0]
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: 'Chiya Ujimatsu',
          options: {
            type: 1
          }
        })
      }

      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle(_locale('events:executionFailure.embedTitle'))
      embed.setDescription(`\`\`\`js\n${error.stack.removePath().slice(0, 1800)}\`\`\``)
      embed.setFooter(`Instance: @${client.user.username}`, client.user.avatarURL)
      embed.setTimestamp()
      client.executeWebhook(webhook.id, webhook.token, {
        embeds: [embed],
        avatarURL: 'https://cdn.discordapp.com/attachments/504668288798949376/874309295049699378/xXDyDuW1M9anceZCtbbUr8sdFP_GE-1kfQVyWWr5zwnpcttU6iW2TSa8LbPJS-97J88XBDu-ulkDiQWPBymMWSswK3bu29vwjoUI.png',
        username: 'Chiya Ujimatsu'
      })
    })

    Logger.error(error)
  }
}
