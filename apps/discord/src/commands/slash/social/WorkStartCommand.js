import { Command, SlashCommandContext } from '../../../structures/util';
import { TypeProfession } from '../../../structures/util/ConstantsTypes';

export default class WorkStartCommand extends Command {
  constructor() {
    super({
      name: 'work start',
      slash: null
    })
  }

  test() {
    return true
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const userDB = ctx.db.user
    const [type, value, emoji, localeCtx, time] = Object.values(TypeProfession).find(([type]) => type === userDB.economy.work.job) ?? []
    const messages = []
    if (userDB.economy.work.job === -1) return ctx.send({
      content: ctx._locale('commands:work.errors.chooseAJob'),
      flags: 1 << 6
    })
    if (userDB.economy.work.arrested) {
      messages.push(ctx._locale('commands:work.messages.arrested'))
      userDB.economy.work.arrested = false
      userDB.save()
    }

    const messageExtra = messages.join('\n') + '\n'

    if (type === 2) return ctx.send({
      content: messageExtra + ctx._locale('commands:work.errors.robError')
    })

    const timestamp = userDB.intervals.job_interval - Date.now()
    if (timestamp > 0) {
      return ctx.send({
        content: messageExtra + '💼 **|** ' + ctx._locale('commands:work.errors.wait', {
          0: `🕙 {{0}}`
        })
      })
    }

    userDB.intervals.job_interval = Date.now() + time
    userDB.economy.value += value

    userDB.save()
      .then(() => ctx.send({
        content: messageExtra + ctx._locale('commands:work.messages.salary', {
          0: value,
          1: '/bank transfer'
        })
      }))
      .catch((err) => console.error(err))
  }
}

