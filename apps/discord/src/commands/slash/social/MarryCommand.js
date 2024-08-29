import { CommandBase, CommandOptions } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Button, Command, Emoji, SlashCommandContext } from '../../../structures/util'

export default class MarryCommand extends Command {
  constructor() {
    super({
      name: 'marry',
      aliases: ['casar'],
      permissions: [{
        entity: 'bot',
        permissions: ['addReactions']
      }],
      slash: new CommandBase()
        .setName('marry')
        .setDescription('Marry with your true love.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention your partner to get married.')
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

    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const author = ctx.db.user
    const couple = await ctx.client.database.users.getOrCreate(member.id)
    if (member.id === ctx.message.author.id) return ctx.replyT('broken_heart', 'commands:marry.cannotMarryWithYourself')
    if (member.id === ctx.client.user.id) return ctx.replyT('broken_heart', 'commands:marry.cannotMarryWithMe')
    if (member.bot) return ctx.replyT('broken_heart', 'commands:marry.cannotMarryWithBot')
    if (author.yens < Number(7500)) return ctx.replyT('error', 'commands:marry.youNeedToMarry', { 0: Number(7500 - author.yens).toLocaleString() })
    if (couple.yens < Number(7500)) return ctx.replyT('error', 'commands:marry.theyNeedToMarry', { 0: member.mention, 1: Number(7500 - couple.yens).toLocaleString() })
    if (author.isMarry) return ctx.replyT('error', 'commands:marry.youAlreadyMarried')
    if (couple.isMarry) return ctx.replyT('error', 'commands:marry.theyAlreadyMarried', { 0: member.mention })
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
      member: member.id,
      author: ctx.message.author.id,
      action: ''
    }, { eventEmitter: true })

    ctx.replyT('warn', 'commands:marry.requestConfirm', {
      0: `<@!${member.id}>`,
      1: `<@!${ctx.message.author.id}>`,
    }, {
      components: [{
        type: 1,
        components: [accept.build(), reject.build()]
      }]
    }).then(message => {
      ctx.createInteractionFunction('marryInteraction', message, {
        state,
        users: [member.id]
      })
      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action === 'confirmButton') {
          author.yens -= Number(7500)
          author.isMarry = true
          author.marryWith = member.id
          couple.yens -= Number(7500)
          couple.isMarry = true
          couple.marryWith = ctx.message.author.id
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
