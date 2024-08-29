import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class EmojiInfoCommand extends Command {
  constructor() {
    super({
      name: 'emojiinfo',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('emojiinfo')
        .setDescription('Get some info about an emoji.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('emoji')
            .setDescription('Mention an emoji to see some info about it')
            .isRequired()
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const emoji = await ctx.getEmoji(ctx.args.get('emoji').value)
    if (!emoji) return ctx.replyT('error', 'basic:invalidEmoji')
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:emojiinfo.embed.title'))
    embed.setThumbnail(emoji.url)
    embed.addField(ctx._locale('commands:emojiinfo.embed.name'), `\`${emoji.name}\``)
    embed.addField(ctx._locale('commands:emojiinfo.embed.id'), `\`${emoji.id}\``)
    embed.addField(ctx._locale('commands:emojiinfo.embed.mention'), `\`${emoji.mention}\``)
    embed.addField(ctx._locale('commands:emojiinfo.embed.url'), `[Download](${emoji.url})`)

    ctx.send(embed.build())
  }
}
