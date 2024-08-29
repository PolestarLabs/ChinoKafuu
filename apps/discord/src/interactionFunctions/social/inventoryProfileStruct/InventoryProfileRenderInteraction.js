import { requestTokamak } from '../../../lib/tokamak';
import { InteractionFunction } from '../../../structures/InteractionFunction';
import { profileInfo as _profileInfo } from '../../../structures/util/Constants'

export default class InventoryProfileRenderInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'inventoryProfileRenderInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editInteraction, ctx }) {
    const {
      user,
      avatar,
      married,
      partnerName,
      profileComponent,
      profileType } = defineState
    const { data, member } = getData()
    const { values } = data
    if (values === undefined) return
    const getProfileInfo = _profileInfo.find((i) => i._id === values[0])
    const profileOptions = profileComponent.map((i) => i.value === values[0] ? { ...i, default: true } : i)

    const profileUser = {
      type: values[0],
      name: member.user.username,
      money: Number(user.yens).toLocaleString(),
      aboutMe: user.aboutme !== '' ? user.aboutme : ctx._locale('commands:profile.defaultAboutMe', { 0: '/' }),
      married: married,
      partnerName: partnerName,
      bgId: user.background,
      stickerId: user.sticker,
      favColor: user.profileColor,
      avatarUrl: avatar,
      badges: []
    }
    const embeds = [{
      title: getProfileInfo.name,
      description: `${getProfileInfo.shortDescription ?? ctx._locale('commands:inventory.noDescription')}`,
      color: 0x5865F2,
      image: {
        url: `attachment://profile-${values[0]}.png`
      }
    }]
    const profile = await requestTokamak({
      action: 'renderProfile',
      profileStruct: profileUser
    })

    defineState.actionState.setState({ embeds })
    const command = ctx.client.commands.find((i) => i.name === 'inventory') ?? null
    const commandProfile = ctx.client.commands.find((i) => i.name === 'profile') ?? null
    const ctxCommand = command === null ? '???' : `</inventory background:${command.id}>`
    const ctxProfileCommand = command === null ? '???' : `</profile:${commandProfile.id}>`

    editInteraction({
      content: ctx._locale('commands:inventory.tips', { 0: ctxCommand, 1: ctxProfileCommand }),
      embeds,
      components: [
        {
          type: 1,
          components: [{
            type: 3,
            custom_id: 'listProfile',
            max_values: 1,
            min_values: 1,
            options: profileOptions
          }]
        },
        {
          type: 1,
          components: [
            {
              type: 2,
              label: ctx._locale('commands:inventory.profile.wantUseThisProfile'),
              style: 1,
              disabled: profileType === values[0] ? true : false,
              custom_id: `profile:${getProfileInfo._id}`
            }
          ],
        },
      ],
      file: {
        image: {
          file: profile.buffer,
          name: `profile-${values[0]}.png`
        }
      }
    })
  }

  typeInteraction() {
    return ['selectMenu']
  }
}