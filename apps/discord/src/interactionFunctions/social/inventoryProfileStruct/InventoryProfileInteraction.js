import { InteractionFunction } from '../../../structures/InteractionFunction';
import { profileInfo } from '../../../structures/util/Constants';

export default class InventoryProfileRenderInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'inventoryProfileInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editInteraction, ctx, deleteInteraction }) {
    const { data, message } = getData()
    const { custom_id } = data
    const { actionState } = defineState
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
    defineState.actionState.setState({ action: profile._id, profileType: profile._id })
    actionState.event
      .once('done', () => {
        const buttonState = message.components[1].components[0]
        const componentsUpdated = [
          message.components[0],
          {
            type: 1,
            components: [{
              ...buttonState,
              disabled: true
            }]
          }
        ]
        const command = ctx.client.commands.find((i) => i.name === 'inventory') ?? null
        const commandProfile = ctx.client.commands.find((i) => i.name === 'profile') ?? null
        const ctxCommand = command === null ? '???' : `</inventory background:${command.id}>`
        const ctxProfileCommand = command === null ? '???' : `</profile:${commandProfile.id}>`

        editInteraction({
          content: [
            ctx.contentWithEmoji('success', 'commands:inventory.success', true, { 0: profile.name.toLocaleLowerCase() }),
            ctx._locale('commands:inventory.tips', { 0: ctxCommand, 1: ctxProfileCommand })
          ].join('\n'),
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