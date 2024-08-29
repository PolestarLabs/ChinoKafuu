import EventEmitter from 'events'
import { ManageState } from '../defineTypes/defineState'
import { InteractionBase } from './InteractionBase'
import { InteractionContext } from './InteractionContext'
import { InteractionRateLimit } from './InteractionRateLimit'
import { Logger } from './util'
const interactions = [5, 3]
export const defineOptionsCtx = (ctx, options = {
  expandFunctionsInOptions: true,
}, defineState) => {
  if (!options.expandFunctionsInOptions) return { ctx, defineState }
  return {
    createMessageInteraction: async (...args) => ctx.createMessageInteraction(...args),
    editMessageInteraction: async (...args) => ctx.editMessageInteraction(...args),
    editT: async (...args) => ctx.editT(...args),
    editInteraction: async (...args) => ctx.editInteraction(...args),
    edit: async (...args) => ctx.edit(...args),
    editMessage: async (...args) => ctx.editMessage(...args),
    editMessageT: async (...args) => ctx.editMessageT(...args),
    getUserInteraction: (...args) => ctx.getUserInteraction(...args),
    reply: async (...args) => ctx.reply(...args),
    replyT: async (...args) => ctx.replyT(...args),
    send: async (...args) => ctx.send(...args),
    sendT: async (...args) => ctx.sendT(...args),
    userGetsInteractionAccess: (...args) => ctx.userGetsInteractionAccess(...args),
    getState: (...args) => typeof ctx.getState === 'function' ? ctx.getState(...args) : ctx.getState,
    deleteInteraction: async (...args) => ctx.deleteInteraction(...args),
    sendEmbedPage: async (...args) => ctx.sendEmbedPage(...args),
    useModal: async (...args) => ctx.useModal(...args),
    _locale: (...args) => ctx.options._locale(...args),
    getData: (...args) => ctx.getData(...args),
    /**
     * This effect can only be used once in each function,
     * if the other function were to use the useState with effects again, it could cancel the previous function and hand it over to the new one.
     *
     * This function is used for cases that are complicated to develop a certain thing and need to receive object updates in real time.
     * @template T
     * @param {(var: T) => void | null} func
     * @param {keyof T} variable
     * @returns {T | null}
     */
    useState: (func = null, variable = null) => {
      if (defineState.helper.tasks !== undefined || defineState.helper.tasks !== null) {
        clearInterval(defineState.helper.tasks)
      }

      if (typeof func === 'function' && Array.isArray(variable)) {
        defineState.helper.tasks = setInterval(() => {
          let valid = true
          const no = ['helper', 'actionState']
          if (defineState.helper.cache == null) {
            valid = false
          }
          const oldCache = defineState.helper.cache
          const newCache = Object.entries(defineState).filter(([key]) => no.includes(key))

          defineState.helper.cache = newCache
          if (valid && defineState.helper.update) {
            func({ ...defineState, defineState }, { oldCache, newCache })
          }
        }, 100)
        return null
      }
      return defineState
    },
    getArg: (key) => {
      if (ctx.trackingCommand === null && ctx.trackingCommand === undefined) {
        return null
      }
      return ctx.trackingCommand.command.interface.get(key) ?? null
    },
    trackingCommand: ctx.trackingCommand,
    ctx,
    defineState
  }
}

export const defineTypeInteraction = (d) => {
  if (typeof d !== 'number') {
    d = d?.data?.component_type
  }
  if (d === componentType.button.type) {
    return componentType.button
  } else if (d === componentType.selectMenus.type) {
    return componentType.selectMenus
  } else if (d === componentType.selectionMenuResolved.type) {
    return componentType.selectionMenuResolved
  } else if (d === componentType.modal) {
    return componentType.modal
  }
  return componentType.any
}

export const defineTypeInteractionMessage = (type, error = false) => {
  const types = ['channelMessageWithSource', 'deferredChannelMessageWithSource', 'deferredUpdateMessage', 'updateMessage', 'applicationCommandAutoComplete', 'modal']
  if (type === 'pong') {
    return 1
  } else if (type === 'channelMessageWithSource') {
    return 4
  } else if (type === 'deferredChannelMessageWithSource') {
    return 5
  } else if (type === 'deferredUpdateMessage') {
    return 6
  } else if (type === 'updateMessage') {
    return 7
  } else if (type === 'applicationCommandAutoComplete') {
    return 8
  } else if (type === 'modal') {
    return 9
  } else if (error && typeof type !== 'string')
    throw Error(`TypeOfError: ${typeof type}: This is not string`)
  else if (error && !types.includes(type))
    throw Error(`TypeInteractionMessageError(${type}): Type of interactions available are -> ${types.join(', ')}.`)

  return 4
}

export const componentType = {
  any: {
    type: -1,
    name: 'any',
    tag: 'any-interaction',
    tags: ['any', 'any-interaction', 'anyInteraction'],
    resolved: false
  },
  button: {
    type: 2,
    name: 'button',
    tag: 'button-interaction',
    tags: ['button', 'buttonInteractions', 'buttonInteraction'],
    resolved: false
  },
  selectMenus: {
    type: 3,
    name: 'selectMenu',
    tag: 'selectMenu-interaction',
    tags: ['select', 'select-menu', 'selectMenu', 'selectMenus'],
    resolved: false
  },
  modal: {
    type: 5,
    name: 'modal',
    tag: 'modal-interaction',
    tags: ['modal', 'modalInteraction', 'modalInterface', 'modalClient'],
    resolved: false
  },
  selectionMenuResolved: {
    type: 8,
    name: 'selectMenuResolved',
    tag: 'selectMenu-interaction-resolved',
    tags: ['selectMenuResolved'],
    resolved: true
  }
}

const parseButtonControlledByPageManager = (interaction) => {
  const data = {
    id: null,
    command: null,
    control: null,
    isPageManager: false
  }
  if (interaction?.data?.custom_id !== undefined && interaction?.data?.component_type === 2) {
    const [id, command, control] = interaction?.data?.custom_id.split(':') ?? undefined
    data.id = id ?? null
    data.command = command ?? null
    data.control = control ?? null
    data.isPageManager = (typeof id === 'string' && typeof command === 'string') && typeof control === 'string'
    return data
  }
  return data
}

const parseModalCommand = (interaction) => {
  const data = {
    id: null,
    command: null
  }
  if (interaction?.data?.custom_id === undefined && interaction?.data?.component_type === undefined) return data
  if (interaction?.type === 5) {
    const [id, command] = interaction?.data?.custom_id.split(':') ?? undefined
    if (id !== 'modal') return data;
    data.id = id ?? null
    data.command = command ?? null
    return data
  }
  return data
}

export class InteractionManager extends EventEmitter {
  constructor(client) {
    super()
    this.interactions = new Array()
    this.rateLimiterManager = new InteractionRateLimit()
    this.client = client
    this.interactionRegistry = client.interactionRegistry
    this.modalIds = []
    this.stateManager = new ManageState()
    this.#addListeners()
    this.#watchInteraction()
  }

  addModal(modalOptions) {
    const modal = this.modalIds.find((m) => m.targetInteraction === modalOptions.targetInteraction)
    if (modal > 0) return this.removeModal(modalOptions)

    this.modalIds.push(modalOptions)
  }

  getModal(data) {
    const modal = this.modalIds.find((m) => m.id === data?.custom_id)
    if (modal == undefined) return null

    return modal
  }

  callbackModal(modalOptions, data) {
    const deleteModal = () => this.removeModal(modalOptions)
    const modal = this.modalIds.find((data) => data.idModal === modalOptions.idModal)
    if (modal === undefined) return;
    modal.updateInteraction(data)
    modal.callback({
      data, modalOptions, deleteModal
    })
  }

  checkModal(id) {
    const modal = this.modalIds.find((m) => id === m.targetInteraction || id === m.id)
    return modal !== undefined
  }

  removeModal(modalOptions) {
    const modal = this.modalIds.findIndex((data) => data.idModal == modalOptions.idModal)

    if (modal < 0) return;

    this.modalIds.splice(modal, 1)
  }

  #addListeners() {
    this.client.on('rawWS', (data) => {
      if (data.t === 'INTERACTION_CREATE') {
        if (!interactions.includes(data?.d?.type)) return
        if (data.d.type === 5) {
          const parse = parseModalCommand(data.d)
          if (parse.command !== null) {
            this.createInteractionModal(data.d.id, 5, {
              expireUntil: 420 * 1000,
              name: parse.command,
              isModal: true,
            })
          }
        }

        this.emit('interactionRaw', ({
          interactionData: data.d,
          typeResolved: defineTypeInteraction(data.d),
          data: data.d.data
        }))
      }
    })
    this.on('interactionRaw', ({ interactionData, typeResolved }) => {
      this.#runnerContext(interactionData, typeResolved)
    })
    this.on('interactionContext', () => {

    })
  }

  /**
   * To remove all interactions when time expires.
   */
  #watchInteraction() {
    setInterval(() => {
      this.rateLimiterManager.users
        .filter((i) => i.finishIn - Date.now() <= 0)
        .map((i) => {
          this.rateLimiterManager.removeUser(i.userID)
        })
      this.interactions
        .filter((i) => i.expireUntil !== null && this.expiresIn !== null)
        .filter((i) => (i.expiresIn - Date.now() + i.expireUntil) <= 0)
        .map((index) => {
          const findInteraction = this.interactions.findIndex((i) => (i.id === index.id || i.messageID === index.messageID) && i.typeResolved === index.typeResolved)

          if (findInteraction >= 0) {
            this.interactions.splice(findInteraction, 1)
          }
          return findInteraction
        })
      this.stateManager.delStates()
    }, 300);

  }

  genID() {
    const a = `${(Math.floor(Math.random() * 10000000000000000000)).toString(16)}`.substring(0, 8)
    const b = `${(Math.floor(Math.random() * 10000000000000000000)).toString(16)}`.substring(0, 4)
    const c = `${(Math.floor(Math.random() * 10000000000000000000)).toString(16)}`.substring(0, 4)
    const d = `${(Math.floor(Math.random() * 10000000000000000000)).toString(16)}`.substring(0, 4)
    const e = `${(Math.floor(Math.random() * 10000000000000000000)).toString(16)}`.substring(0, 12)

    return [a, b, c, d, e].join('-')
  }

  async #runnerContext(interaction, typeResolved) {
    let getInteraction = this.getInteraction(interaction.id, interaction?.message?.id, typeResolved)
    if (interaction.guild_id === undefined && interaction.user_id === undefined) return

    const getDataDB = await this.client.database.flux({
      search: {
        guilds: [{ fetch: { id: interaction.guild_id }, data: { prefix: process.env.PREFIX }, getOrAdd: true }],
        users: [{ fetch: { id: interaction.member.id }, data: { shipValue: Math.floor(Math.random() * 55) }, getOrAdd: true }],
      }
    })

    const guildData = getDataDB.getQuery('guilds', (query) => query.typeQuery === interaction.guild_id)
    const _locale = this.client.i18nRegistry.getT(guildData.data.lang)
    const isModal = interaction.type === 5

    if (isModal) {
      if (this.checkModal(interaction?.data?.custom_id ?? '')) {
        this.callbackModal(this.getModal(interaction.data), interaction)
        return
      }
    }
    const parseButton = parseButtonControlledByPageManager(interaction)
    if (parseButton.isPageManager) {
      getInteraction = this.getInteraction(parseButton.id, null, typeResolved)
    }

    const ctx = new InteractionContext(interaction, this.client, null, this, { interactionData: interaction, typeResolved, _locale, interactionBase: getInteraction, isModal }, getInteraction)
    if (getInteraction === null || getInteraction === undefined) {
      return ctx.replyT('cocoa_what', 'basic:message.interactionExpired', { enableEphemeral: true })
    }
    if (getInteraction.id.includes('-')) {
      getInteraction.id = interaction.id
    }
    if (!ctx.userGetsInteractionAccess(ctx.getMemberInteraction.id)) {
      const content = getInteraction.getCustomMessageTranslateInteraction(ctx.data)?.customMessage?.userLimited ?? 'basic:message.interactionOtherUser'
      return ctx.replyT('cocoa_what', content, { enableEphemeral: true, webhook_id: interaction.message.webhook_id })
    }
    if (typeResolved !== undefined && this.rateLimiterManager.checkUser(ctx.data.member.user.id))
      return ctx.replyT('cocoa_what', 'basic:message.interactionRateLimit', { enableEphemeral: true, webhook_id: interaction.message.webhook_id })

    if (getInteraction.isEmbedPage || parseButton.isPageManager) {
      getInteraction.sendInteraction(interaction, ctx)
      return
    }
    if (parseButton.isPageManager) return
    try {
      getInteraction.interactionCurrent = interaction
      getInteraction.runner(defineOptionsCtx(ctx, { expandFunctionsInOptions: true }, getInteraction.state))
    } catch (errorStack) {
      Logger.error(errorStack)
      console.error(errorStack)
      await ctx.replyT('error', 'basic:message.interactionError', { enableEphemeral: true })
    }
  }

  getInteraction(id, messageID) {
    const checkMessageOrInteraction = (i) => {
      if (typeof messageID === 'string') return i.id === id || i.messageID === messageID
      return i.id === id
    }
    return this.interactions.find((i) => checkMessageOrInteraction(i)) ?? null
  }

  removeInteraction(id) {
    const index = this.interactions.findIndex((i) => i.id === id || i.name)
    if (index >= 0)
      this.interactions.splice(index, 1)

    return index >= 0
  }

  createInteractionBase(messageID, typeResolved, options = { expireUntil: null, state: null, message: null, isEmbedPage: false, embedPage: null }) {
    this.interactions.push(new InteractionBase(this.genID() + `:${messageID}`, messageID, typeResolved, this, options))
  }

  createInteractionModal(interactionID, typeResolved, options = { expireUntil: null, state: null, message: null, isEmbedPage: false, embedPage: null }) {
    this.interactions.push(new InteractionBase(interactionID, null, typeResolved, this, options))
  }

  createInteraction(interactionBase = null) {
    if (interactionBase instanceof InteractionBase) {
      this.interactions.push(interactionBase)
    } else
      throw Error('That is not InteractionBase')
    return interactionBase
  }

  async hookInteraction(interaction, data, file = null) {
    return this.client.requestHandler.request('POST', `/interactions/${interaction.id}/${interaction.token}/callback`, true, data, file ?? null)
  }

  async webhookCreateFollowupMessage(interaction, data) {
    return this.client.requestHandler.request('POST', `/webhooks/${interaction.id}/${interaction.token}/callback`, true, data, null)
  }

  async webhookEditFollowupMessage(interaction, data) {
    return this.client.requestHandler.request('PATCH', `/webhooks/${interaction.id}/${interaction.token}/callback`, true, data, null)
  }

  async webhookDeleteFollowupMessage(interaction) {
    return this.client.requestHandler.request('DELETE', `/webhooks/${interaction.id}/${interaction.token}/callback`, true, null, null)
  }

}