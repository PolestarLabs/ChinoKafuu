import { defineState } from '../../../defineTypes/defineState'
import { Command, SlashCommandContext } from '../../../structures/util'
import { profileInfo } from '../../../structures/util/Constants'

export default class InventoryProfileCommand extends Command {
  constructor() {
    super({
      name: 'inventory profile',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const user = ctx.db.user
    const avatar = ctx.message.author.avatarURL
    const marryWith = user.isMarry ? await ctx.getUser(user.marryWith) : null
    const profiles = Object.entries(profileInfo)
    const profileComponent = profiles
      // eslint-disable-next-line no-unused-vars
      .filter(([_, v]) => (v.disabled === false && v.readyForSale) || v.isDefault === true)
      .filter(([_, v]) => user.profileList.includes(v._id))
      // eslint-disable-next-line no-unused-vars
      .map(([_, v]) => ({
        label: ctx._locale(`basic:profiles.${v._id.toLocaleLowerCase()}.name`),
        value: v._id,
        description: ctx._locale(`basic:profiles.${v._id.toLocaleLowerCase()}.shortDescription`),
        custom_id: v.buttonId,
        default: false
      }))
    const state = defineState({
      action: '',
      componentSelected: '',
      profileType: user.profileType,
      married: user.isMarry,
      partnerName: marryWith ? `@${marryWith?.username}` : '',
      user,
      marryWith,
      avatar,
      profileInfo,
      profileComponent,
      componentsProfile: [
        {
          type: 1,
          components: [{
            type: 3,
            custom_id: 'listProfile',
            max_values: 1,
            min_values: 1,
            options: profileComponent
          }]
        }
      ]
    }, { eventEmitter: true })
    ctx.send({
      content: ctx._locale('commands:inventory.profile.welcome'),
      components: [
        {
          type: 1,
          components: [{
            type: 3,
            custom_id: 'listProfile',
            max_values: 1,
            min_values: 1,
            options: profileComponent
          }]
        }
      ]
    }).then((message) => {
      ctx.createInteractionFunction(['inventoryProfileRenderInteraction', 'inventoryProfileInteraction'], message, {
        state,
        users: [ctx.message.author.id]
      })

      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action !== '' && stateUpdated.profileType !== undefined) {
          user.profileType = stateUpdated.profileType
          user.save()
            .then(() => {
              state.actionState.event.emit('done')
            }).catch((err) => {
              state.actionState.event.emit('error', err)
            })
        }
      })
    })
  }
}
