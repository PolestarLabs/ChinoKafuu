/* eslint-disable no-unused-vars */

import { InteractionFunction } from '../../structures/InteractionFunction'
export default class WorkInteractionSelection extends InteractionFunction {
  constructor() {
    super({
      name: 'workInteractionSelection'
    })
  }

  async interactionFunction({ getData, defineState, editMessageInteraction, ctx, _locale, deleteInteraction }) {
    const { data } = getData()
    if (data.custom_id.startsWith('work:')) {
      return
    }
    const [typeInteraction, jobSelected] = data.custom_id.split(':')
    const state = defineState

    state.actionState.event
      .once('done', () => {
        const commandName = jobSelected != 2 ? 'work' : 'rob'
        const command = ctx.client.commands.find((i) => i.name === commandName) ?? null
        if (jobSelected != 2) {
          editMessageInteraction({
            content: `💼 **|** ` + _locale('commands:work.contextSuccess.success', {
              0: `</${commandName} start:${command?.id ?? '{0}'}>`
            }),
            components: [],
            embeds: []
          })
          deleteInteraction()
        } else {
          editMessageInteraction({
            content: `🤫 **|** ` + _locale('commands:work.contextSuccess.successSecret', {
              0: `</rob:${command?.id ?? '{0}'}>`
            }),
            enableEphemeral: true,
            components: [],
            embeds: []
          })
          deleteInteraction()
        }

      })
      .once('error', (err) => {
        editMessageInteraction({
          content: _locale('commands:work.buttonConfirm')
        })
        deleteInteraction()
      })

    state.actionState.setState({
      action: 'confirmButton',
      data: {
        jobSelected
      }
    })

  }

  typeInteraction() {
    return ['button']
  }
}

const filterJob = (y) => Array.isArray(y)

