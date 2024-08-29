/* eslint-disable no-unused-vars */

import { InteractionFunction } from '../../structures/InteractionFunction'
import { TypeProfession } from '../../structures/util/ConstantsTypes'
import { TimeStringLocale } from '../../structures/util/TimeString'

const embedJob = (_locale, data = {}) => ({
  title: data.emoji + ' | ' + _locale('commands:work.choose.jobSelected', { 0: _locale(data.text) }),
  description: _locale('commands:work.choose.jobDescription', {
    0: _locale(data.text) ?? '{{0}}',
    1: TimeStringLocale(data.time, _locale) ?? 0,
    2: (data?.salary ?? 0).toLocaleString() + '¥'
  }),
  color: 16111443
})

export default class WorkInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'workInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editMessageInteraction, ctx, _locale, deleteInteraction }) {
    const { data } = getData()
    const state = defineState
    const findJob = Object.entries(TypeProfession)
      .find(([key, _]) => key === data.values[0])

    const job = findJob[0] != undefined ?
      findJob
        .filter(filterJob)
        .map(([type, salary, emoji, text, time]) => ({ type, salary, emoji, text, time }))
        .at(0)
      : undefined

    const embed = embedJob(_locale, job)

    if (state.defaultMessage.embeds !== undefined) {
      // Delete embed in state
      delete state.defaultMessage.embeds
    }

    // Push new update of button.
    if (state.defaultMessage.components.at(1)) {
      state.defaultMessage.components.splice(1, 1)
    }

    state.defaultMessage.components.push({
      type: 1,
      components: [{
        type: 2,
        label: _locale('commands:work.buttonConfirm'),
        style: state.job === job.type ? 2 : 1,
        disabled: state.job === job.type,
        custom_id: `job:${job.type}`
      }]
    })

    // Update menu selection list.
    const menu = state.defaultMessage.components
      .at(0)
      .components
      .at(0)

    menu.options.map((obj, index) => {
      obj.default = index === job.type
      return obj
    })

    editMessageInteraction({
      embeds: [embed],
      ...state.defaultMessage
    })
  }

  typeInteraction() {
    return ['selectMenu']
  }
}

const filterJob = (y) => Array.isArray(y)

