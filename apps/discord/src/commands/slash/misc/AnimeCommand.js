import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
import malScraper from 'mal-scraper'
import { CommandBase, CommandOptions } from 'eris'

export default class AnimeCommand extends Command {
  constructor() {
    super({
      name: 'anime',
      aliases: ['malanime'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('anime')
        .setDescription('Shows some information about a anime.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('name')
            .setDescription('Insert anime name to search result.')
            .isRequired(),
        )
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {

    const search = ctx.args.get('name').value
    const t = ctx._locale
    if (!search) return ctx.replyT('error', 'commands:anime.invalidAnime')

    try {
      const anime = await malScraper.getInfoFromName(search)
      const embed = new EmbedBuilder()
      embed.setThumbnail(anime.picture)
      embed.setColor('DEFAULT')
      embed.setTitle(t('commands:anime.synopsis'))
      embed.setDescription(anime?.synopsis)
      embed.setFooter(`©️ ${ctx.client.user.username}`)
      embed.setTimestamp()
      embed.addField(t('commands:anime.animeName'), anime.englishTitle ?? anime.japaneseTitle, true)
      embed.addField(t('commands:anime.type'), anime.type, true)
      embed.addField(t('commands:anime.episodes'), anime.episodes, true)
      embed.addField(t('commands:anime.rating'), anime.rating, true)
      embed.addField(t('commands:anime.aired'), anime.aired, true)
      embed.addField(t('commands:anime.score'), anime.score, true)
      embed.addField(t('commands:anime.scoreStats'), anime.scoreStats, true)
      embed.addField(t('commands:anime.duration'), anime.duration, true)
      embed.addField(t('commands:anime.ranked'), anime.ranked, true)
      embed.addField(t('commands:anime.popularity'), anime.popularity, true)
      embed.addField('Trailer', `[${t('basic:clickHere')}](${anime.trailer})`, true)
      embed.addField(t('commands:anime.genres'), anime.genres.join(', '), true)

      ctx.send(embed.build())
    } catch {
      ctx.replyT('error', 'commands:anime.animeNotFound', { 0: search })
    }
  }
}
