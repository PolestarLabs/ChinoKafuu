import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class UserBannerCommand extends Command {
  constructor() {
    super({
      name: 'user banner',
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
    const member = await ctx.getUser(ctx.args.get('user')?.value?.id ?? ctx.args.get('user')?.value, true)
    const banner = member.bannerURL
    const download = new Button()
    download.setStyle(5)
    download.setURL(banner)
    download.setLabel(ctx._locale('commands:userbanner.download'))
    download.setEmoji({ name: Emoji.getEmoji('photo_frame').name })

    const embed = new EmbedBuilder()
    embed.setTitle(`${Emoji.getEmoji('photo_frame').mention} ${ctx._locale('commands:userbanner.userBanner', { 0: member.username })}`)
    embed.setImage(banner)
    embed.setColor('DEFAULT')
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send({ embeds: [embed], components: [{ type: 1, components: [download.build()] }] })
  }
}
