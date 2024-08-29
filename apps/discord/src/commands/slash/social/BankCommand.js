import { CommandBase } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class BankCommand extends Command {
  constructor() {
    super({
      name: 'bank',
      slash: new CommandBase()
        .setName('bank')
        .setDescription('Transfer or check the amount that is in the bank.')
        .addOptions()
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const state = defineState({
      user: ctx.db.user
    }, {
      eventEmitter: false
    })
    const { economy } = ctx.db.user
    const text = ctx._locale('commands:bank.message', {
      0: economy.bank.toLocaleString(),
      1: economy.value.toLocaleString()
    })

    ctx.reply('yen', {
      embeds: [{
        color: 0x7cf564,
        title: '💰 | Bank',
        description: text,
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 1,
              label: ctx._locale('commands:bank.button.transfer'),
              custom_id: 'transfer',
              disabled: false
            },
            {
              type: 2,
              style: 1,
              label: ctx._locale('commands:bank.button.withDraw'),
              custom_id: 'withDraw',
              disabled: false
            },
          ]
        }
      ]
    }).then((message) => {
      ctx.createInteractionFunction('bankInteraction', message, {
        state,
        users: [ctx.message.author.id]
      })
    })
  }
}