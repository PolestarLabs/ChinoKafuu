import { CommandBase, CommandOptions } from 'eris';
import { defineState } from '../../../defineTypes/defineState';
import { Command, SlashCommandContext } from '../../../structures/util';
import { TypeProfession } from '../../../structures/util/ConstantsTypes';

export default class WorkCommand extends Command {
  constructor() {
    super({
      name: 'work choose',
      slash: new CommandBase()
        .setName('work')
        .setDescription('No description')
        .addOptions(
          new CommandOptions()
            .setType(1)
            .setName('choose')
            .setDescription('No description'),
          new CommandOptions()
            .setType(1)
            .setName('start')
            .setDescription('No description')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const userDB = ctx.db.user

    const jobsList = Object.entries(TypeProfession)
      .map(([k, [type, salary, emoji, text, time]]) => {
        return {
          label: ctx._locale(text.toString()),
          value: k,
          description: ctx._locale(`commands:work.description.${k}`),
          custom_id: k,
          emoji: {
            id: null,
            name: emoji
          }
        }
      })

    const commandWork = ctx.client.commands.find((i) => i.name === 'work')?.id ?? null
    const commandRob = ctx.client.commands.find((i) => i.name === 'rob')?.id ?? null

    const state = defineState({
      userDB: ctx.db.user,
      job: userDB.economy.work.job,
      defaultMessage: {
        embeds: [{
          title: ctx._locale(`commands:work.choose.title`),
          description: ctx._locale(`commands:work.choose.description`) +
            '\n\n' +
            reformAsOrder(ctx._locale(`commands:work.rules`, {
              0: commandRob != null ? `</rob:${commandRob}>` : '{0}',
              1: commandWork != null ? `</work start:${commandWork}>` : '{0}',
              2: '',
            })),
          color: 16111443
        }],
        components: [{
          type: 1,
          components: [{
            type: 3,
            custom_id: 'select:listProfile',
            max_values: 1,
            min_values: 1,
            options: jobsList
          }]
        }]
      }
    }, { eventEmitter: true })

    const useThen = (message) => {
      ctx.createInteractionFunction(interactionFunctions, message, {
        state,
        users: [ctx.message.author.id]
      })

      state.actionState.event.on('stateUpdated', async (stateUpdated) => {
        const profission = Object.entries(TypeProfession)
          .map(([_, [type, salary, emoji, text, time, name]]) => ({ type, salary, emoji, text, time, name }))
          .find((i) => i.type === Number(stateUpdated.data.jobSelected))

        if (profission === undefined && profission === null) {
          state.actionState.event.emit('refuseInteraction')
          return;
        }
        if (profission.type != 2) {
          userDB.intervals.job_interval = Date.now() + profission.time
        }
        userDB.economy.work.job = profission.type
        userDB.lastUpdates.job = Date.now()
        userDB.save().then(() => {
          state.actionState.event.emit('done')
        })

      })
    }

    if (userDB.economy.work.job != -1)
      return ctx.send({
        content: `❓ **|** ` + ctx._locale(userDB.economy.work.job === 2 ? 'commands:work.errors.robError' : 'commands:work.errors.message'),
        flags: userDB.economy.work.job === 2 ? 1 << 6 : 0,
        components: [{
          type: 1,
          components: [
            {
              type: 2,
              label: ctx._locale(`commands:work.yes`),
              style: 1,
              custom_id: 'work:continue'
            },
            {
              type: 2,
              label: ctx._locale(`commands:work.no`),
              style: 2,
              custom_id: 'work:no'
            }
          ]
        }]
      })
        .then(useThen)
    else {
      if (!(userDB.intervals.job_interval - Date.now() <= 0)) return ctx.send({ content: '💼 **|** ' + ctx._locale(`commands:work.errors.cannotChangeJobsAtTheMoment`) })
      if (!(userDB.intervals.rob_interval - Date.now() <= 0)) return ctx.send({ content: '💼 **|** ' + ctx._locale(`commands:work.errors.cannotChangeJobsAtTheMoment`), flags: 1 << 6 })
    }

    ctx.send(state.defaultMessage).then(useThen)
  }
}

const interactionFunctions = ['workInteraction', 'workInteractionSelection', 'workInteractionAffirmation']
const reformAsOrder = (text = '') => {
  return text.replace(/([0-9]+ - .*)/g, (str) => '\n  ' + str + '\n')
    .replace(/(([0-9]\s)[-])/g, (str) => `**${str}**`)
}