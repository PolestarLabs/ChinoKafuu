import { isAsyncFunction } from 'util/types'
import { defineTypeInteraction } from './InteractionManager'

export class InteractionBase {
  constructor(
    id,
    messageID,
    typeResolved,
    interactionManager,
    options = {
      expireUntil: null,
      state: null,
      message: null,
      isEmbedPage: false,
      embedPage: null
    }
  ) {
    this.id = id
    this.name = options.name ?? ''
    this.messageID = messageID ?? null
    this.message = options.message ?? null
    this.typeResolved = typeResolved
    this.interactionManager = interactionManager
    this._once = false
    this.guildData = null
    this.isEmbedPage = options.isEmbedPage ?? false
    /**
     * Paging system is a different structure when applying class state or data updates.
     */
    this.embedPage = options.embedPage ?? null
    this.userData = null
    // Don't set any time.
    this.expiresIn = typeof options.expireUntil === 'number' ? Date.now() + options.expireUntil : null
    this.expireUntil = typeof options.expireUntil === 'number' ? options.expireUntil : null
    // This is further set by Modal to track the command executed by the User to get the parameter entered.
    this.trackingCommand = options.trackingCommand ?? {}
    this.usersData = []
    this.users = options.users ?? []
    this.interactionCurrent = null
    this.state = options.state ?? null
    this.isModal = options.isModal ?? false
    this.modalState = {}
  }

  getCustomMessageTranslateInteraction(data) {
    const translations = { customMessage: {} }
    this.#whichInteractionIsWorking(data)
      .map((i) => {
        if (i?.customMessage !== undefined) {
          Object.assign(translations.customMessage, i.customMessage)
        }
      })

    return translations
  }

  #whichInteractionIsWorking({ data }) {
    if (Array.isArray(this.name)) {
      const findInteraction = (name) => this.interactionManager.interactionRegistry.findByName(name).typeInteraction()

      return this.name
        .filter((i) => findInteraction(i)
          .find((interactionType) => defineTypeInteraction(data.component_type).tags.includes(interactionType)) ?? false)
        .map((i) => this.interactionManager.interactionRegistry.findByName(i))
    }

    return [this.interactionManager.interactionRegistry.findByName(this.name)]
  }

  setEmbedPage(embedPage) {
    if (this.embedPage === null)
      this.embedPage = embedPage
  }

  sendInteraction(interaction, ctx) {
    if (this.embedPage === null) return
    this.embedPage.emit('interaction', ({ interaction, ctx }))
  }

  updateGuildData(guildData) {
    // To check if the data is different. It's a safe and fast way.
    if (JSON.stringify(guildData) === JSON.stringify(this.guildData)) {
      this.guildData = guildData
    }
  }

  updateUserData(userData) {
    // To check if the data is different. It's a safe and fast way.
    if (JSON.stringify(userData) === JSON.stringify(this.userData)) {
      this.guildData = userData
    }
  }

  addUser(userID) {
    return this.users.push(userID)
  }

  removerUser(userID) {
    const position = this.users.findIndex((i) => i === userID)
    return this.users.splice(position, 1)
  }

  runner(args) {
    if (Array.isArray(this.name)) {
      const { data } = args.ctx
      const interactions = this.#whichInteractionIsWorking(data)
      interactions.map(async (interaction) => {
        if (interaction.mode !== undefined) {
          if (isAsyncFunction(interaction.R)) {
            interaction.R(args).catch((err) => { throw err })
          } else {
            interaction.R(args)
          }
        } else {
          if (!this._once) {
            interaction.once(args)
          }
          await interaction.interactionFunction(args)
        }
      })
      this._once = true
      return
    }

    const interaction = this.interactionManager.interactionRegistry.findByName(this.name)
    if (!this._once) {
      this._once = true
      if (interaction?.mode === undefined && interaction?.mode !== 'define') {
        interaction.once(args)
      }
    }
    if (interaction?.mode !== undefined && interaction?.mode === 'define') {
      if (isAsyncFunction(interaction.R)) {
        interaction.R(args).catch((err) => { throw err })
      } else {
        interaction.R(args)
      }
    } else {
      if (isAsyncFunction(interaction.interactionFunction)) {
        interaction.interactionFunction(args).catch((err) => { throw err })
      } else {
        interaction.interactionFunction(args)
      }
    }
  }

}