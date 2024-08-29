import { defineState } from '../../../defineTypes/defineState'
import { ConstantBackground, getBackground } from '../../../lib'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class InventoryBackgroundCommand extends Command {
  constructor() {
    super({
      name: 'inventory background',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   */
  async run(ctx) {
    const useState = defineState({
      memberState: { avatarURL: ctx.message.member.avatarURL },
      user: ctx.db.user,
      pageState: {

      },
      stateMessage: {
        backgroundDefault: {},
        profileSelected: 'default',
        profileUrl: '',
        disabled: false,
      },
      metadataMessage: {
        attachments: []
      }
    })
    const backgroundImage = await getBackground(useState.user.background, {
      cache: true
    })
    const valueBackground = Object.values(ConstantBackground)
    const backgroundSelected = valueBackground.find((value) => useState.user.background == value.name)
    useState.stateMessage.backgroundDefault = backgroundSelected
    useState.stateMessage.disabled = true
    const backgroundIsDefault = useState.stateMessage.backgroundDefault.name === 'gochiusa_3' ? ` (${ctx._locale('commands:inventory.background.default')})` : ''
    const backgroundAvailable = valueBackground
      .map((value) => ({
        label: value.title + (value.name == useState.user.background ? ' (' + ctx._locale('commands:inventory.background.used') + ')' : ''),
        value: value.name,
        description: ctx.db.user.backgroundList.find((v) => value.name == v) ?
          '🔓 ' + ctx._locale('commands:inventory.background.unlocked') : ctx._locale('commands:inventory.background.locked'),
        emoji: ctx.db.user.backgroundList.find((v) => value.name == v) ? value.emoji : { id: null, name: '🔒' },
        disabled: true,
        default: value.name == useState.user.background
      }))

    useState.metadataMessage = {
      embeds: [
        {
          color: useState.user.profileColor.convertToColor(),
          title: `✨🖼️ **|** **${ctx._locale('commands:inventory.background.title', { 0: useState.stateMessage.backgroundDefault.title })}**`,
          description: `${ctx._locale('commands:inventory.background.description', { 0: `<@${ctx.db.user.id}>` })}\n###  - 🖼️ **${ctx._locale('commands:inventory.background.backgroundName', { 0: useState.stateMessage.backgroundDefault.title + backgroundIsDefault })}**\n###  - <:chino_woah:568083767684628481> **${ctx._locale('commands:inventory.background.profile', { 0: useState.user.profileType.toTitle() })}**\n###  - 🎒 **${ctx._locale('commands:inventory.background.backgroundQuantity', { 0: useState.user.backgroundList.length - 1 })}**`,
          image: {
            url: `attachment://${useState.user.background}.png`
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
              label: ctx._locale(useState.stateMessage.disabled ? 'commands:inventory.background.backgroundDefault' : 'commands:inventory.background.selectBackground'),
              custom_id: `select:${useState.backgroundDefault}`,
              disabled: useState.stateMessage.disabled,
              emoji: {
                id: null,
                name: useState.stateMessage.disabled ? '📌' : '💙'
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
    ctx.send(useState.metadataMessage, {
      file: {
        name: useState.user.background + '.png',
        file: backgroundImage
      }
    }).then((message) => {
      ctx.createInteractionFunction(['inventoryBackgroundCommand'], message, {
        state: useState,
        users: [ctx.message.author.id]
      })
    })

  }
}
