/* eslint-disable no-unused-vars */

import { InteractionFunction } from '../../structures/InteractionFunction'
import { TimeStringLocale } from '../../structures/util/TimeString'

const embedJob = (_locale, data = {}) => ({
  title: data.emoji + ' | ' + _locale('commands:work.choose.jobSelected', { 0: _locale(data.text) }),
  description: _locale('commands:work.choose.jobDescription', {
    0: _locale(data.text) ?? '{{0}}',
    1: TimeStringLocale(data.time, _locale) ?? 0,
    2: (data?.salary ?? 0).toLocaleString() + '¥'
  }),
})

export default class WorkInteractionAffirmation extends InteractionFunction {
  constructor() {
    super({
      name: 'workInteractionAffirmation'
    })
  }

  async interactionFunction({ getData, defineState, editMessageInteraction, _locale, deleteInteraction }) {
    const { data } = getData()
    const customId = data.custom_id
    if (!customId.startsWith('work:')) {
      return
    }
    const state = defineState

    if (customId === 'work:continue') {
      editMessageInteraction({
        content: '',
        ...state.defaultMessage
      })
    } else {
      editMessageInteraction({
        content: '🚫 **|** ' + _locale('commands:work.iChangedMyMind'),
        components: []
      })
      deleteInteraction()
    }
  }

  typeInteraction() {
    return ['button']
  }
}

const filterJob = (y) => Array.isArray(y)

