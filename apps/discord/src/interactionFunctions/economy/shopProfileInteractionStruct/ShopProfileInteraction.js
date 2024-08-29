import { InteractionFunction } from '../../../structures/InteractionFunction';
import { profileInfo } from '../../../structures/util/Constants';

export default class InventoryProfileRenderInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'shopProfileInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editInteraction, ctx, deleteInteraction }) {
    const { data, message } = getData()
    const { custom_id } = data
    const { actionState } = defineState
    if (!data.custom_id.startsWith('profile:')) return
    const profile = profileInfo.find((i) => i._id === custom_id.replace('profile:', '')) ?? null

    // Something went wrong...
    if (profile === null) {
      editInteraction({
        content: ctx._locale('basic:message.interactionSuspectedBug'),
        embeds: message.embeds,
        components: message.components,
        attachments: [],
      })
      throw Error(`ProfileError/InventoryProfileRenderInteraction: ${custom_id} is invalid!`)
    }
    defineState.actionState.setState({ action: profile._id, profileType: profile._id, price: profile.price })
    actionState.event
      .once('done', () => {
        const buttonState = message.components[1].components[1]
        const componentsUpdated = [
          message.components[0],
          {
            type: 1,
            components: [
              message.components[1].components[0],
              {
                ...buttonState,
                disabled: true
              }]
          }
        ]
        const command = ctx.client.commands.find((i) => i.name === 'inventory') ?? null
        const ctxProfileCommand = command === null ? '???' : `</inventory profile:${command.id}>`
        editInteraction({
          content: ctx.contentWithEmoji('success', 'commands:shop.profile.successfullyPurchased', true, { 0: ctxProfileCommand }),
          components: componentsUpdated,
        })
      })
      .once('error', (err) => {
        deleteInteraction()
        throw err
      })
  }

  typeInteraction() {
    return ['button']
  }
}