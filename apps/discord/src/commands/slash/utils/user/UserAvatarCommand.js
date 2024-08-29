import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class UserAvatarCommand extends Command {
  constructor() {
    super({
      name: 'user avatar',
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
    let avatar = member.avatarURL
    const download = new Button()
    download.setStyle(5)
    download.setURL(avatar)
    download.setLabel(ctx._locale('commands:avatar.download'))
    download.setEmoji({ name: Emoji.getEmoji('photo_frame').name })

    if (ctx.args.get('guild-avatar')?.value) {
      const guildMember = await ctx.getMember(member.id)
      avatar = guildMember?.guildAvatar ?? member.avatarURL
    }
    const embed = new EmbedBuilder()
    embed.setTitle(`${Emoji.getEmoji('photo_frame').mention} ${ctx._locale('commands:avatar.userAvatar', { user: member.username })}`)
    embed.setImage(avatar)
    embed.setColor('DEFAULT')
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send({ embeds: [embed], components: [{ type: 1, components: [download.build()] }] })
  }
}
