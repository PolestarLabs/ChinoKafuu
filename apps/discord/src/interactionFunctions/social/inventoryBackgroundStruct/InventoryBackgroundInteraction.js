/* eslint-disable no-unused-vars */
/* eslint-disable no-const-assign */
/* eslint-disable import/named */
import { createStateGeneric } from '../../../defineTypes/defineState';
import { ConstantBackground, getBackground, requestTokamak } from '../../../lib';
// eslint-disable-next-line no-unused-vars
import { defineInteraction, defineInteractionDefault, defineInteractionFunction } from '../../../structures/InteractionFunction';

/**
 * @type {{
 *   memberState: { avatarURL: string; };
 *   user: { id: string };
 *   pageState: {};
 *   stateMessage: {
 *       backgroundDefault: ConstantBackground['gochiusa_3'];
 *       profileSelected: keyof ConstantBackground;
 *       profileUrl: string;
 *   };
 *   metadataMessage: { embeds: [], components: [], content: '' | null };
 *}}
 */
const StateUser = createStateGeneric();

export default defineInteractionDefault(
  defineInteraction({
    name: 'inventoryBackgroundCommand'
  }),
  defineInteractionFunction(async ({ ctx, getData, useState, defineState }) => {
    const { data, member } = getData()
    const updateMessage = async (isUpdate = false, content = '') => {
      const userDB = await ctx.client.database.users.getOrCreate(member.user.id)
      const { metadataMessage, stateMessage, user, actionState } = useState()
      const valueBackground = Object.values(ConstantBackground)

      const backgroundSelected = valueBackground.find((value) => isUpdate ? stateMessage.backgroundDefault.name == value.name : data?.values.at(0) == value.name)
      const backgroundImage = await getBackground(backgroundSelected.name, {
        cache: true
      })
      actionState.modifyObject({
        stateMessage: {
          backgroundDefault: backgroundSelected,
          disabled: userDB.background === backgroundSelected.name
        }
      })
      const backgroundIsDefault = stateMessage.backgroundDefault.name === 'gochiusa_3' ? ` (${ctx._locale('commands:inventory.background.default')})` : ''
      const backgroundAvailable = valueBackground
        .map((value) => ({
          label: value.title + (value.name == user.background ? ' (' + ctx._locale('commands:inventory.background.used') + ')' : ''),
          value: value.name,
          description: userDB.backgroundList.find((v) => value.name == v) ?
            '🔓 ' + ctx._locale('commands:inventory.background.unlocked') : ctx._locale('commands:inventory.background.locked'),
          emoji: userDB.backgroundList.find((v) => value.name == v) ? value.emoji : { id: null, name: '🔒' },
          default: stateMessage.backgroundDefault.name == value.name
        }))
      const metadataUpdated = {
        metadataMessage: {
          attachments: [],
          content,
          embeds: [
            {
              color: user.profileColor.convertToColor(),
              title: `✨🖼️ **|** **${ctx._locale('commands:inventory.background.title', { 0: backgroundSelected.title })}**`,
              description: `${ctx._locale('commands:inventory.background.description', { 0: `<@${userDB.id}>` })}\n###  - 🖼️ **${ctx._locale('commands:inventory.background.backgroundName', { 0: stateMessage.backgroundDefault.title + backgroundIsDefault })}**\n###  - <:chino_woah:568083767684628481> **${ctx._locale('commands:inventory.background.profile', { 0: user.profileType.toTitle() })}**\n###  - 🎒 **${ctx._locale('commands:inventory.background.backgroundQuantity', { 0: user.backgroundList.length - 1 })}**`,
              image: {
                url: `attachment://${backgroundSelected.name}.png`
              }
            }
          ],
          components: [
            {
              type: 1,
              components: [{
                type: 3,
                custom_id: 'inventoryBackground',
                max_values: 1,
                min_values: 1,
                options: backgroundAvailable
              }]
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label: ctx._locale('commands:inventory.background.reload'),
                  custom_id: 'reload',
                  emoji: {
                    id: null,
                    name: '🔄'
                  }
                },
                {
                  type: 2,
                  style: 1,
                  label: ctx._locale(userDB.background === backgroundSelected.name ? 'commands:inventory.background.backgroundDefault' : 'commands:inventory.background.selectBackground'),
                  custom_id: `select:${stateMessage.backgroundDefault.name}`,
                  disabled: userDB.background === backgroundSelected.name,
                  emoji: {
                    id: null,
                    name: userDB.background === backgroundSelected.name ? '📌' : '💙'
                  }
                },
                {
                  type: 2,
                  style: 3,
                  label: ctx._locale('commands:inventory.background.previewProfile'),
                  custom_id: 'profilePreview',
                  emoji: {
                    id: null,
                    name: '✨'
                  }
                }
              ]
            }
          ]
        }
      }
      actionState.modifyObject(metadataUpdated)
      ctx.editMessage(metadataUpdated.metadataMessage, {
        image: {
          name: backgroundSelected.name + '.png',
          file: backgroundImage
        }
      })
    }

    // Profile Preview
    if (data.custom_id === 'profilePreview' && data.component_type == 2) {
      const { memberState, metadataMessage, stateMessage } = useState()
      const userDB = await ctx.client.database.users.getOrCreate(member.user.id)
      const profileUser = {
        type: userDB.profileType,
        name: member.user.username,
        money: Number(userDB.yens).toLocaleString(),
        aboutMe: userDB.aboutme !== '' ? userDB.aboutme : ctx._locale('commands:profile.defaultAboutMe', { 0: '/' }),
        married: false,
        partnerName: '',
        bgId: stateMessage.backgroundDefault.name,
        stickerId: userDB.sticker,
        favColor: userDB.profileColor,
        avatarUrl: memberState.avatarURL,
        badges: []
      }
      const profile = await requestTokamak({
        action: 'renderProfile',
        profileStruct: profileUser
      })
      metadataMessage.embeds[0].image.url = 'attachment://profile.png'
      ctx.editMessage(metadataMessage, {
        image: {
          name: 'profile.png',
          file: profile.buffer
        }
      })
      return
    }

    // Update background
    if (data.custom_id === 'inventoryBackground' && data.component_type == 3) {
      const { metadataMessage, stateMessage, user, actionState } = useState()
      const userDB = await ctx.client.database.users.getOrCreate(member.user.id)
      if (userDB.backgroundList.find((background) => data.values.find((i) => background == i)) == null) {
        return ctx.replyT('error', 'commands:inventory.background.needsToBuy', {
          enableEphemeral: true,
          options: { mentionUser: [member.user.id] }
        })
      }
      const background = Object.values(ConstantBackground).find((bg) => bg.name === data.values.at(0))
      actionState.modifyObject({
        stateMessage: {
          backgroundDefault: background
        }
      })
      updateMessage()
    }

    // Select Background
    if (data.custom_id.startsWith('select:') && data.component_type == 2) {
      const { metadataMessage, stateMessage, user, actionState } = useState()
      // eslint-disable-next-line no-unused-vars
      const [_, background] = data.custom_id.split(':')
      user.background = background
      user.save()
        .then(() => updateMessage(true, '<:gochiusa_success:788464186752499732> **|** ' + ctx._locale('commands:inventory.background.success')))
        .catch((error) => {
          updateMessage(true, '<:gochiusa_error:788464284316991508> **|** ' + ctx._locale('commands:inventory.background.error'))
          throw error
        })
      return
    }

    // Reload
    if (data.custom_id === 'reload' && data.component_type == 2) {
      updateMessage(true)
      return
    }
  }, StateUser)
)
