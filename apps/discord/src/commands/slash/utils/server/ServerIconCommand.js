import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class ServerIconCommand extends Command {
  constructor() {
    super({
      name: 'server icon',
      aliases: ['guildicon'],
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
    if (!guild.icon) return ctx.replyT('error', 'commands:servericon.missingIcon')

    const embed = new EmbedBuilder()
    embed.setImage(guild.iconURL)
    embed.setColor('DEFAULT')
    embed.setTitle(`${Emoji.getEmoji('discord_logo').mention} ${guild.name}`)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    const button = new Button()
    button.setLabel(ctx._locale('commands:servericon.download'))
    button.setEmoji({ name: Emoji.getEmoji('photo_frame').name })
    button.setStyle(5)
    button.setURL(guild.iconURL)

    ctx.send({ embeds: [embed], components: [{ type: 1, components: [button] }] })
  }
}
