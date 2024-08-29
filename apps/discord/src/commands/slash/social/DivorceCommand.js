import { CommandBase } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Button, Command, Emoji, SlashCommandContext } from '../../../structures/util'

export default class DivorceCommand extends Command {
  constructor() {
    super({
      name: 'divorce',
      aliases: ['divorciar'],
      permissions: [{
        entity: 'bot',
        permissions: ['addReactions']
      }],
      slash: new CommandBase()
        .setName('divorce')
        .setDescription('Divorces you to your current partner (I will charge 300 yens to divorce).')
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const author = ctx.db.user
    if (!author.isMarry) return ctx.replyT('error', 'commands:divorce.youAreNotMarried', { 0: ctx.db.guild.prefix })
    const couple = await ctx.client.database.users.getOrCreate(author.marryWith)
    if (author.yens < Number(300)) return ctx.replyT('error', 'commands:divorce.youNeedToDivorce', { 0: Number(300 - author.yens).toLocaleString() })
    if (couple.yens < Number(300)) return ctx.replyT('error', 'commands:divorce.theyNeedToDivorce', { 0: Number(300 - couple.yens).toLocaleString() })
    const accept = new Button()
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
      author: ctx.message.author.id,
      action: ''
    }, { eventEmitter: true })

    ctx.replyT('warn', 'commands:divorce.requestConfirm', {}, {
      components: [{
        type: 1,
        components: [accept.build(), reject.build()]
      }]
    }).then(message => {
      ctx.createInteractionFunction('divorceInteraction', message, {
        state,
        users: [ctx.message.author.id]
      })
      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action === 'confirmButton') {
          author.yens -= Number(300)
          author.isMarry = false
          author.marryWith = ''
          couple.yens -= Number(300)
          couple.isMarry = false
          couple.marryWith = ''
          author.save()
          couple.save()
            .then(() => {
              state.actionState.event.emit('done')
            }).catch((err) => {
              state.actionState.event.emit('error', err)
            })
        }
      })
    })
  }
}
