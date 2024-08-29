import { CommandBase, CommandOptions } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Button, Command, Emoji, SlashCommandContext } from '../../../structures/util'

export default class PayCommand extends Command {
  constructor() {
    super({
      name: 'pay',
      aliases: ['pagar', 'doar'],
      permissions: [{
        entity: 'bot',
        permissions: ['addReactions']
      }],
      slash: new CommandBase()
        .setName('pay')
        .setDescription('Sends money to a user')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
            .isRequired(),
          new CommandOptions()
            .setType(4)
            .setName('amount')
            .setDescription('Amount of yen you want to transfer.')
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
    const member = await ctx.getUser(ctx.args.get('user').value?.id ?? ctx.args.get('user').value) ?? ctx.args.get('user').member ?? null
    if (!member) return ctx.replyT('error', 'basic:invalidUser')

    const fromUser = ctx.db.user
    const value = ctx.args.get('amount').value
    const toUser = await ctx.db.db.getOrCreate(member.id)

    if (ctx.message.member.id === member.id) return ctx.replyT('error', 'commands:pay.userMismatch')
    if (!value) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (isNaN(Number(value))) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (Number(value) === Infinity) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (value <= 0) return ctx.replyT('error', 'commands:pay.valueMismatch')
    if (value > fromUser.yens) return ctx.replyT('error', 'commands:pay.poorUser')
    const totalYens = Math.round(value)
    const confirm = new Button()
      .setLabel(ctx._locale('basic:boolean.true'))
      .customID('confirmButton')
      .setStyle(3)
      .setEmoji({ name: Emoji.getEmoji('success').name, id: Emoji.getEmoji('success').id })
    const reject = new Button()
      .setLabel(ctx._locale('basic:boolean.false'))
      .customID('rejectButton')
      .setStyle(4)
      .setEmoji({ name: Emoji.getEmoji('error').name, id: Emoji.getEmoji('error').id })
    const state = defineState({
      member: member.id,
      author: ctx.message.author.id,
      action: '',
      totalYens,
      yens: totalYens,
      total: value
    }, { eventEmitter: true })

    ctx.replyT('warn', 'commands:pay.confirm', { user: member.mention, yens: totalYens, total: value }, {
      components: [{
        type: 1,
        components: [confirm.build(), reject.build()]
      }]
    }).then(message => {
      ctx.createInteractionFunction('payInteraction', message, {
        state,
        users: [ctx.message.author.id]
      })
      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action === 'confirmButton') {
          fromUser.yens -= stateUpdated.totalYens
          toUser.yens += stateUpdated.totalYens
          state.actionState.event.emit('done')
          ctx.db.user.save()
          toUser.save()
        }
      })
    })
  }
}
