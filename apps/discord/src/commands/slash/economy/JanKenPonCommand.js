/* eslint-disable security/detect-object-injection */
import { Choice, CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'
import { Emoji } from '../../../structures/util/EmotesInstance'

export default class JanKenPonCommand extends Command {
  constructor() {
    super({
      name: 'jankenpon',
      aliases: ['ppt', 'pedrapapeltesoura', 'rps', 'janken'],
      slash: new CommandBase()
        .setName('jankenpon')
        .setDescription('Plays jankenpon and win or lose yens')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('choice')
            .setDescription('Choose one of these options.')
            .addChoices(
              new Choice()
                .setName('rock')
                .setValue('rock'),
              new Choice()
                .setName('paper')
                .setValue('paper'),
              new Choice()
                .setName('scissors')
                .setValue('scissors'),
            )
            .isRequired(),
          new CommandOptions()
            .setType(10)
            .setName('value')
            .setDescription('Value that you wanna bet on the game.')
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
    const user = await ctx.db.user
    const client = await ctx.client.database.users.getOrCreate(ctx.client.user.id)
    const options = ['pedra', 'papel', 'tesoura']
    if (!['pedra', 'papel', 'tesoura', 'rock', 'paper', 'scissors'].includes(ctx.args.get('choice').value.toLowerCase())) return ctx.replyT('error', 'commands:jankenpon.optionNotFound')
    const clientChoice = options[Math.floor(Math.random() * options.length)]
    const me = ctx.args.get('choice').value.toLowerCase()
    let result
    let emoji
    const value = ctx.args.get('value').value
    if (!value) return ctx.replyT('warn', 'commands:jankenpon.valueNotInputed') // Type-0
    const invalidValue = Number(value) < 0 || Number(value) === Infinity || isNaN(value)
    if (invalidValue) return ctx.replyT('error', 'commands:pay.invalidValue')
    if (user.yens < value) return ctx.replyT('error', 'commands:pay.poorUser')
    const clientChoiceMappings = {
      tesoura: ['pedra', 'rock'],
      papel: ['tesoura', 'scissors'],
      pedra: ['papel', 'paper']
    }

    const clientDrawMappings = {
      tesoura: 'scissors',
      pedra: 'rock',
      papel: 'paper',
      scissors: 'scissors',
      rock: 'rock',
      paper: 'paper'
    }

    const userWinOption = (clientChoiceMappings[clientChoice]).includes(clientDrawMappings[me])
    if (userWinOption) {
      emoji = 'chino_upset'
      result = ctx._locale('commands:jankenpon.youWin', { 0: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[me]}`), 1: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[clientChoice]}`), 2: Number(value).toLocaleString() })
      user.yens += Math.floor(value)
      user.save()
      if (Number(value) <= client.yens) {
        client.yens -= Math.floor(value)
        client.save()
      }
    } else if (clientDrawMappings[clientChoice] === clientDrawMappings[me]) {
      emoji = 'chino_whoa'
      result = ctx._locale('commands:jankenpon.tie')
    } else if (!userWinOption) {
      emoji = 'chino_kek'
      result = ctx._locale('commands:jankenpon.youLose', { 0: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[me]}`), 1: ctx._locale(`commands:jankenpon.choice.${clientDrawMappings[clientChoice]}`), 2: Number(value).toLocaleString() })
      user.yens -= Math.floor(value)
      client.yens += Math.floor(value)
      user.save()
      client.save()
    }

    ctx.send('Jan ken pon').then(msg => {
      setTimeout(() => {
        msg.edit(`${Emoji.getEmoji(emoji).mention} **|** ${ctx.message.author.mention}, ${result}`)
      }, 2000)
    })
  }
}
