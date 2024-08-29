import { requestTokamak } from '../../../lib/tokamak';
import { InteractionFunction } from '../../../structures/InteractionFunction';
import { profileInfo as _profileInfo } from '../../../structures/util/Constants';
export default class InventoryProfileRenderInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'shopProfileRenderInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editInteraction, ctx }) {
    const {
      avatar,
      married,
      partnerName,
      profileComponent } = defineState
    const { data, member, message } = getData()
    const { values } = data

    if (values === undefined && data.custom_id.startsWith('refresh:') === false) return

    const profileName = data.custom_id.startsWith('refresh:') ?
      data.custom_id.replace('refresh:', '')
      : values[0]
    const user = await ctx.client.database.users.getOrCreate(member.user.id)
    const getProfileInfo = _profileInfo.find((i) => i._id === profileName)
    const profiles = Object.entries(_profileInfo)
    const profileOptions = profiles
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
    const profileUser = {
      type: profileName,
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
    const embed = message.embeds.find((i) => i.image.url.endsWith(`profile-${profileName}.png`) === true) ?? {}

    let profile = null
    let imageMetadata = null
    if (embed.image?.url === undefined) {
      profile = await requestTokamak({
        action: 'renderProfile',
        profileStruct: profileUser
      })
      imageMetadata = {
        image: {
          file: profile.buffer,
          name: `profile-${profileName}.png`
        }
      }
    }

    const embeds = [{
      title: getProfileInfo.name,
      description: `${getProfileInfo.shortDescription ?? ctx._locale('commands:inventory.noDescription')}`,
      color: 0x5865F2,
      image: {
        url: `attachment://profile-${profileName}.png`
      }
    }]

    defineState.actionState.setState({ embeds })
    const valueOfPrice = Math.min((user.yens / getProfileInfo.price) * 100, 100)
    const readyForBuy = !(valueOfPrice >= 99)
    const stateButton = !user.profileList.includes(getProfileInfo._id) ? (user.yens >= getProfileInfo.price ? false : readyForBuy) : true
    editInteraction({
      content: readyForBuy ?
        '💴 **|** ' + ctx._locale('commands:shop.profile.valueInsufficientMessage', {
          0: getProfileInfo.price.toLocaleString(),
          1: (getProfileInfo.price - user.yens).toLocaleString()
        })
        :
        '💴 **|** ' + ctx._locale(readyForBuy ? 'commands:shop.profile.profileInfo' : 'commands:shop.profile.buyProfile', { 0: getProfileInfo.price.toLocaleString() }),
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
              style: 2,
              label: '',
              emoji: {
                id: null,
                name: '🔄'
              },
              custom_id: `refresh:${getProfileInfo._id}`,
              disabled: false,
            },
            {
              type: 2,
              label:
                !user.profileList.includes(getProfileInfo._id) ? (user.yens >= getProfileInfo.price ?
                  ctx._locale('commands:shop.profile.price', { 0: getProfileInfo.price.toLocaleString() }) :
                  ctx._locale('commands:shop.profile.valueInsufficient'))
                  : ctx._locale('commands:shop.profile.alreadyHaveThisProfile', { 0: getProfileInfo.price.toLocaleString() }),
              style: !user.profileList.includes(getProfileInfo._id) ? (user.yens >= getProfileInfo.price ? 3 : 4) : 2,
              disabled: stateButton,
              custom_id: `profile:${getProfileInfo._id}`
            }
          ],
        },
      ],
      file: imageMetadata
    })
  }

  typeInteraction() {
    return ['selectMenu', 'button']
  }
}