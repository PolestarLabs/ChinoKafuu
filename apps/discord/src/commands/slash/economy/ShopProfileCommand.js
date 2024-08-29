import { defineState } from '../../../defineTypes/defineState'
import { Command, SlashCommandContext } from '../../../structures/util'
import { profileInfo } from '../../../structures/util/Constants'

export default class ShopProfileCommand extends Command {
  constructor() {
    super({
      name: 'shop profile',
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
    const profiles = Object.entries(profileInfo)
    const avatar = ctx.message.author.avatarURL
    const marryWith = user.isMarry ? await ctx.getUser(user.marryWith) : null
    const profileComponent = profiles
      // eslint-disable-next-line no-unused-vars
      .filter(([_, v]) => v.isDefault === false && v.readyForSale === true)
      .filter(([_, v]) => v.disabled === false)
      // eslint-disable-next-line no-unused-vars
      .map(([_, v]) => ({
        label: (user.profileList.includes(v._id) ? `${ctx._locale(`basic:profiles.${v._id}.name`)} - (${ctx._locale('commands:shop.itemPurschased')})` : v.name),
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
      content: ctx._locale('commands:shop.profile.welcomeToTheShop'),
      components: [{
        type: 1,
        components: [{
          type: 3,
          custom_id: 'listProfile',
          max_values: 1,
          min_values: 1,
          options: profileComponent
        }]
      }]
    }).then((message) => {
      ctx.createInteractionFunction(['shopProfileRenderInteraction', 'shopProfileInteraction'], message, {
        state,
        users: [ctx.message.author.id]
      })

      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action !== '' && stateUpdated.profileType !== undefined) {
          user.yens -= stateUpdated.price
          user.profileList.push(stateUpdated.profileType)
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
