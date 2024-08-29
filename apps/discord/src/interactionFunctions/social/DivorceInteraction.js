import { InteractionFunction } from '../../structures/InteractionFunction';

export default class DivorceInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'divorceInteraction',
      customMessage: {
        userLimited: 'commands:divorce.needToWait'
      }
    })
  }

  interactionFunction({ getData, defineState, editT, ctx, deleteInteraction }) {
    const { data } = getData()
    if (data.custom_id !== undefined && data.custom_id === 'confirmButton') {
      defineState.actionState.setState({ action: 'confirmButton' })
      defineState.actionState.event.once('done', () => {
        deleteInteraction()
        editT({ name: 'ring_couple', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:divorce.successfullyDivorced')}`, {
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
      editT({ name: 'heart', type: 'mention' }, ` **|** <@!${defineState.author}>, ${ctx._locale('commands:divorce.rejectedRequest')}`, {
        components: []
      })

    }

  }
}