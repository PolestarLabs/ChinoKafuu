
import { InteractionFunction } from '../../structures/InteractionFunction'

export default class PayInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'payInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editT, ctx, deleteInteraction }) {
    const { data } = getData()
    const state = defineState
    if (data.custom_id !== undefined && data.custom_id === 'confirmButton') {
      state.actionState.event.once('done', () => {
        deleteInteraction()
        editT({ name: 'yen', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:pay.success', { yens: defineState.totalYens, user: `<@${defineState.member}>` })}`, {
          components: []
        })
      })
        .once('error', (err) => {
          deleteInteraction()
          throw err
        })
      state.actionState.setState({ action: 'confirmButton', totalYens: defineState.totalYens })
    } else if (data.custom_id !== undefined && data.custom_id === 'rejectButton') {
      deleteInteraction()
      editT({ name: 'error', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:pay.cancelled')}`, {
        components: []
      })

    }
  }

  typeInteraction() {
    return ['button']
  }
}