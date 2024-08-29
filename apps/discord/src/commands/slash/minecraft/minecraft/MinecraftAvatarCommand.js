import { Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class MinecraftAvatarCommand extends Command {
  constructor() {
    super({
      name: 'minecraft avatar',
      aliases: [],
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
    const body = `https://mc-heads.net/avatar/${ctx.args.get('minecraft-nickname').value}/256.png`
    const embed = new EmbedBuilder()
    embed.setColor('MINECRAFT')
    embed.setImage(body)
    embed.setDescription(`${Emoji.getEmoji('minecraft').mention} [[Download]](${body})`)
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()
    ctx.send(embed.build())
  }
}
