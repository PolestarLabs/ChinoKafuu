import axios from 'axios'
import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class SetBannerCommand extends Command {
  constructor() {
    super({
      name: 'setbanner',
      permissions: [{
        entity: 'both',
        permissions: ['manageGuild']
      }],
      slash: new CommandBase()
        .setName('setbanner')
        .setDescription('Sets the banner of your server (not available for all servers).')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('url')
            .setDescription('The URL of the new banner.')
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
    if (!ctx.message.guild.features.includes('BANNER')) return ctx.replyT('error', 'commands:setbanner.missingFeature')
    const url = ctx.args.get('url').value
    const buffer = await axios.get(url, { responseType: 'arraybuffer' }).then(d => Buffer.from(d.data, 'binary').toString('base64'))
    const base64Banner = `data:image/${url.substr(url.length - 3)};base64,${buffer}`

    ctx.message.guild.edit({
      banner: base64Banner
    })
      .then(() => {
        const embed = new EmbedBuilder()
          .setTitle(ctx._locale('commands:setbanner.success'))
          .setColor('DEFAULT')
          .setImage(url)
        ctx.send(embed.build())
      })
  }
}
