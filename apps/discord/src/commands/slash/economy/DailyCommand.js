import { CommandBase } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext, TopGGUtils } from '../../../structures/util'

export default class DailyCommand extends Command {
  constructor() {
    super({
      name: 'daily',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('daily')
        .setDescription('You can get your daily yens by using this command')
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    const top_gg = new TopGGUtils()
    const user = ctx.db.user
    if (parseInt(user.timeDaily) > Date.now()) {
      return ctx.replyT('error', 'commands:daily.hasBeenPicked', {
        0: `<t:${parseInt(user.timeDaily / 1000).toFixed(0)}:R>`
      })
    }

    const hasVoted = await top_gg.getVote(ctx.message.member.id)

    if (!hasVoted) {
      const embed = new EmbedBuilder()
      embed.setColor('DEFAULT')
      embed.setAuthor(ctx._locale('commands:daily.almostThere'), ctx.message.member.avatarURL)
      embed.setThumbnail('https://cdn.discordapp.com/attachments/481851013628952587/836021066056859667/tumblr_provapZJJi1uo8t89o1_1280.png')
      embed.setDescription(ctx._locale('commands:daily.explaining'))
      embed.addField(ctx._locale('commands:daily.proceed'), ctx._locale('commands:daily.confirm'))

      return ctx.send(embed.build())
    }

    const amount = Math.floor(Math.random() * (3500 - 300 + 1)) + 300
    const amountSg = Math.floor(Math.random() * (350 - 15 + 1)) + 15
    user.yens += amount
    user.sugarcube += amountSg
    user.timeDaily = 43200000 + Date.now()
    user.save().then(() => {
      const embed = new EmbedBuilder()
      embed.setColor('DEFAULT')
      embed.setThumbnail('https://cdn.discordapp.com/attachments/504668288798949376/800132564227719193/artworks-000454557840-nvbn35-t500x500.png')
      embed.setTitle(ctx._locale('commands:daily.yensDaily'))
      embed.setDescription(ctx._locale('commands:daily.congrats', { 0: Number(amount).toLocaleString(), 1: Number(amountSg).toLocaleString() }))

      ctx.send(embed.build())
    })
  }
}
