import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class ServerBannerCommand extends Command {
  constructor() {
    super({
      name: 'server banner',
      aliases: ['guildbanner'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const guild = ctx.message.guild
    if (!guild.features.includes('BANNER')) return ctx.replyT('error', 'commands:serverbanner.missingFeature')
    if (!guild.banner) return ctx.replyT('error', 'commands:serverbanner.missingBanner')

    const embed = new EmbedBuilder()
    embed.setImage(guild.bannerURL)
    embed.setColor('DEFAULT')
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()
    const button = new Button()
      .setEmoji({ name: Emoji.getEmoji('photo_frame').name })
      .setLabel(ctx._locale('commands:serverbanner.download'))
      .setStyle(5)
      .setURL(guild.bannerURL)
    ctx.send({ embeds: [embed], components: [{ type: 1, components: [button] }] })
  }
}
