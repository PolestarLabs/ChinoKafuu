import { InteractionFunction } from '../../structures/InteractionFunction';

export default class MarryInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'marryInteraction',
      customMessage: {
        userLimited: 'commands:marry.needToWait'
      }
    })
  }

  interactionFunction({ getData, defineState, editT, ctx, deleteInteraction }) {
    const { data } = getData()
    if (data.custom_id !== undefined && data.custom_id === 'confirmButton') {
      defineState.actionState.setState({ action: 'confirmButton' })
      defineState.actionState.event.once('done', () => {
        deleteInteraction()
        editT({ name: 'ring_couple', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:marry.successfullyMarried')}`, {
          components: []
        })
      })
        .once('error', (err) => {
          deleteInteraction()
          throw err
        })
    } else if (data.custom_id !== undefined && data.custom_id === 'rejectButton') {
      defineState.actionState.setState({ action: 'rejectButton' })
      deleteInteraction()
      editT({ name: 'heart', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:marry.rejectedRequest', { 0: `<@${defineState.member}>` })}`, {
        components: []
      })

    }

  }
}