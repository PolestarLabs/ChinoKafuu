import { CommandBase } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class RobCommand extends Command {
  constructor() {
    super({
      name: 'rob',
      slash: new CommandBase()
        .setName('rob')
        .setDescription('Steal a random amount from a user.')
        .addOptions()
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    if (ctx.db.user.economy.work.job != 1) return ctx.replyT('error', 'commands:rob.error', {})
    if (ctx.db.user.intervals.rob_interval - Date.now() > 0) return ctx.replyT('error', 'commands:rob.timeout', {})

    const users = ctx.getInteraction.channel.guild.members
      .filter((user) => user.id != ctx.message.author.id)
      .map((user) => user.id)
    const engine = ctx.client.database.advancedDataSearchEngine().users
    const matchingUsers = await engine.matchingIds(
      [...users],
      [],
      ['yens', 'id', 'intervals', 'lastUpdates', 'economy'],
      { sort: { 'economy.value': -1 } }
    )
    if (matchingUsers.length <= 0) return ctx.replyT('error', 'commands:rob.didNotFindAnyoneNearby', {})

    const usersData = matchingUsers.map((u) => ({ id: u.id, value: u.economy.value, economy: u.economy, isPolicie: u.economy.work.job === 1 }))
    const policies = usersData.filter((u) => u.isPolicie === true)
    const otherProfession = usersData
      .filter((u) => u.isPolicie === false)
      .filter((user) => user.economy.value >= 50)
    const userRandom = otherProfession
      .sort(() => Math.random() - 0.5)
      .at(Math.max(0, Math.floor(Math.random() * otherProfession.length) - 1))

    if (userRandom === undefined) return ctx.replyT('error', 'commands:rob.errorWhilePlanning', {})

    const amount = Math.min(Math.random() * 2400, Math.max(0, Math.random() * userRandom.economy.value))
    const percent = (policies.length / otherProfession.length) * 100
    const percentArrested = (otherProfession.length / Math.max(100, policies.length)) * 100
    const calc = Math.min(100, Math.abs(percent - percentArrested) + Math.ceil(Math.floor(Math.random() * 9)))
    const policie = policies
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(8, Math.max(1, Math.max(1, policies.length) - (Math.floor(Math.random() * 2)))))

    const chance = (12 - Math.min(100, Math.floor((2 / 1800) * 100)))
    const value = Math.max(1, (27 * policies.length) - Math.floor(Math.random() * chance))

    if (calc > value) {
      const userData = await ctx.db.db.getOrCreate(userRandom.id)

      userData.economy.value -= Math.floor(amount)
      ctx.db.user.economy.value += Math.floor(amount)
      ctx.db.user.intervals.rob_interval = Date.now() + (3 * 60 * 60 * 1000)
      ctx.db.user.save()
      userData.save()
      return ctx.replyT('success', 'commands:rob.missionAccomplished', { 0: `<@!${ctx.message.author.id}>`, 1: Math.floor(amount).toLocaleString() })
    }

    ctx.db.user.economy.work.arrested = true
    ctx.db.user.intervals.rob_interval = Date.now() + (3 * 60 * 60 * 1000)
    ctx.db.user.save()
    ctx.replyT('error', 'commands:rob.youWereArrested', { 0: `${policie.map((u) => `<@!${u.id}>`).join(', ')}` })
  }
}