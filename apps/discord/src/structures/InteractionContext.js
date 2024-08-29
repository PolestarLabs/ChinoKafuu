import { randomUUID } from 'node:crypto'
import { defineTypeInteraction, defineTypeInteractionMessage } from './InteractionManager'
import { Emoji, Logger } from './util'
import { Emojis } from './util/Emojis'
const listOfEmojis = Emojis
export class InteractionContext {
  constructor(data, client, messageCreated, interactionManager, options, interactionBase) {
    this.client = client
    this.messageCreated = messageCreated
    this.interactionManager = interactionManager
    this.options = options ?? {}
    this.id = options.interactionData.id
    this.interactionData = options.interactionData
    this.typeResolved = options.typeResolved
    this.token = options.interactionData.token
    this.interactionBase = interactionBase
    this.trackingCommand = interactionBase?.trackingCommand
    this.isModal = options.isModal ?? false
    this.data = data ?? {}
  }

  async sendEmbedPage(embedPageManager, data) {
    this.interactionBase.isEmbed = true
    this.interactionBase.embedPage = embedPageManager
    if (this.interactionBase.isModal) {
      try {
        this.interactionBase.isModal = false
        return this.createMessageInteraction({
          type: 4,
          data: {
            ...embedPageManager.prepareToSend(true)
          }
        })
      } catch (err) {
        console.log(err)
        return null
      }
    }

    return this.editInteraction(embedPageManager.prepareToSend())
  }

  /**
   * @returns {{
   *  version: number;
   *  type: number;
   *  token: string;
   *  message: {
   *    webhook_id: string;
   *    type: number;
   *    tts: boolean
   *    timestamp: string;
   *    pinned: boolean;
   *    mentions: [];
   *    mentions_role: [];
   *    interaction: {
   *      user: { id: string }
   *      type: 2,
   *      name: string;
   *      id: string;
   *    } | null
   *    id: string;
   *    flags: number;
   *    embeds: [];
   *    edited_timestamp: string | null;
   *    content: string;
   *    components: [];
   *    channel_id: string | null;
   *    author: {
   *      username: string;
   *      public_flags: number;
   *      id: string;
   *      global_name: string;
   *      bot: boolean;
   *      avatar_decoration: string;
   *      avatar: string;
   *    } | null;
   *    attachments: [] | null;
   *   locale: string | null;
   *  }
   *  member: {
   *     user: {
   *       username: string;
   *       public_flags: number;
   *       id: string;
   *       global_name: string | null;
   *       discriminator: string | null;
   *       avatar_decoration: string | null;
   *       avatar: string | null;
   *     } | null;
   *     unusual_dm_activity_until: null;
   *     roles: string[] | null;
   *     premium_since: string | null;
   *     pending: boolean;
   *     nick: string | null;
   *     mute: boolean;
   *     joined_at: string | null;
   *     flags: number;
   *     deaf: boolean;
   *     avatar: string | null;
   *  } | null
   *  id: string | null;
   *  guild_locale: string | null;
   *  guild_id: string | null;
   *  guild: {
   *    locale: string | null;
   *    id: string | null;
   *    features: string[] | null
   *  } | null;
   *  data: { custom_id: string | null; component_type: 2 } | { custom_id: string | null; component_type: 3; values: string[] | null }
   *  application_id: string | null;
   *  app_permissions: string | null;
   * }}
   */
  getData() {
    return this.data
  }

  deleteInteraction() {
    if (typeof this.interactionBase?.state?.actionStatedestroy === 'function') {
      this.interactionBase?.state?.actionStatedestroy()
    }
    this.interactionManager.removeInteraction(this.id)
  }

  userGetsInteractionAccess(userID = '') {
    // If the list is empty, it will not be limited. That is, it will return true.
    if (this.interactionBase.users.length <= 0) return true
    return this.interactionBase.users.includes(userID)
  }

  _locale(...args) {
    return this.options._locale(...args)
  }

  useModal(title, callback, components) {
    const custom_id = randomUUID()
    const checkLimit = (text = '', limit = 20, type = '') => {
      if (text.length >= limit) {
        Logger.warning(`UseModalWarning: The field limit of ${type} exceeded the character limit. The maximum is ${limit} characters.`)
        return text.slice(0, limit - 4) + '...'
      }
      return text
    }
    this.interactionManager.addModal({
      id: custom_id,
      targetInteraction: this.interactionBase.id,
      callback,
      updateInteraction: (interactionData) => {
        this.token = interactionData.token
        this.id = interactionData.id
      }
    })
    return this.patchMessage({
      type: 9,
      data: {
        title: typeof title === 'string' ? checkLimit(title, 45, 'title') : 'Title Unknown',
        custom_id,
        components: [
          {
            type: 1,
            components: [...(Array.isArray(components) ? components : [])]
          },
        ]
      }
    })
  }

  async editT(emoji, content, data = {}, ...props) {
    return this.editMessageInteraction({
      content: this.contentWithEmoji(emoji, content),
      ...data
    })
  }

  async edit(emoji, content, data = {}, ...props) {
    return this.editMessageInteraction({
      content: this.contentWithEmoji(emoji, content, false),
      ...data
    })
  }

  async editInteraction(data = {}) {
    return this.editMessageInteraction(data)
  }

  patchMessage(data, file = {}) {
    return this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, data ?? {}, file?.image ?? null)
  }

  async editMessageInteraction(data = {}) {
    let file = null
    let type = defineTypeInteractionMessage('updateMessage')
    if (data.enableEphemeral) {
      delete data.enableEphemeral
      data.flags = 1 << 6
    }
    if (data.typeInteraction) {
      delete data.typeInteraction
      type = defineTypeInteractionMessage(data.typeInteraction)
    }
    if (data.file) {
      file = data.file
      delete data.file
    }
    return this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, {
      type: type,
      data: data,
    }, file?.image ?? null)
  }

  async createMessageInteraction(option = {
    type: defineTypeInteractionMessage('channelMessageWithSource'),
    data: {},
    attachments: null
  }) {
    let file = null
    if (typeof type === 'string') {
      this.type = defineTypeInteraction(this.type, true)
    }
    if (option?.file) {
      file = option.file
      delete option.file
    }
    if (option?.data?.enableEphemeral !== undefined && option?.data?.enableEphemeral) {
      delete option.data.enableEphemeral
      option.data.flags = (1 << 1) + (1 << 6)
    }
    if (option?.enableEphemeral !== undefined && option?.enableEphemeral) {
      delete option.enableEphemeral
      option.data.flags = (1 << 1) + (1 << 6)
    }
    let attachments = null

    if (option.attachments !== undefined) {
      attachments = option.attachments
      delete option.attachments
    }
    return this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, {
      type: option?.type ?? defineTypeInteractionMessage(option.type),
      data: option.data,
    }, file?.image ?? null)
  }

  async editMessage(data, file = undefined) {
    const metadata = {
      type: defineTypeInteractionMessage('updateMessage'),
      data
    }
    return this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, metadata ?? {}, file?.image ?? null)
  }

  async editMessageT(emoji, content, ctx = {}, data = {
    enableEphemeral: false
  }, file) {
    let enableEphemeral = false
    if (data.enableEphemeral !== undefined) {
      enableEphemeral = true
      delete data.enableEphemeral
    }
    const metadata = {
      type: defineTypeInteractionMessage('updateMessage'),
      data: {
        content: this.contentWithEmoji(emoji, content, true, ctx),
        flags: enableEphemeral ? 1 >> 6 : 0,
        ...data.data
      },
    }
    return this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, metadata ?? {}, file?.image ?? null)
  }

  /**
   * @arg {keyof listOfEmojis} emoji
   * @arg {string} content
   * @arg {{enableEphemeral?: boolean; options: { mentionUser?: string[] | null; } | null; data?: any}} data
   */
  async replyT(emoji, content, data = {
    enableEphemeral: false,
    options: {
      mentionUser: null
    }
  }, ...props) {
    return this.createMessageInteraction({
      type: data?.type ?? defineTypeInteractionMessage('channelMessageWithSource'),
      data: {
        content: this.contentWithEmoji(emoji, content, true, data.options),
        enableEphemeral: data.enableEphemeral,
        ...data.data
      },
      ...props
    })
  }

  async send(content, data = {}, ...props) {
    return this.createMessageInteraction({
      type: data?.type ?? defineTypeInteractionMessage('channelMessageWithSource'),
      data: {
        content: content,
        ...data.data
      },
      ...props
    })
  }

  async sendT(content, dataLocale = {}, data = {}, ...props) {
    return this.createMessageInteraction({
      type: data?.type ?? defineTypeInteractionMessage('channelMessageWithSource'),
      data: {
        content: this._locale(content, dataLocale),
        ...data.data
      },
      ...props
    })
  }

  async reply(emoji, content, data = {}, ...props) {
    return this.createMessageInteraction({
      type: data?.type ?? defineTypeInteractionMessage('channelMessageWithSource'),
      data: {
        content: this.contentWithEmoji(emoji, content),
        ...data.data
      },
      ...props
    })
  }

  getUserInteraction(userID = null) {
    if (userID !== undefined && userID !== null) return this.client.users.get(userID)
    const user = (this.interactionData?.member?.user?.id ?? this.interactionData?.user?.id) ?? null

    return this.client.users.get(user)
  }

  get getMemberInteraction() {
    return this.getUserInteraction()
  }

  contentWithEmoji(emoji, content = '', ...args) {
    const data = {}
    args
      .filter((arg) => typeof arg === 'object')
      .map((i) => Object.assign(data, i))
    const IsTranslate = args.find((i) => i === true || i === false)
    const t = typeof IsTranslate === 'boolean' && IsTranslate ? this._locale(content, data) : content
    let str = ''
    if (typeof emoji === 'string') {
      str = `${Emoji.getEmoji(emoji).mention}${data?.mentionUser ? ' ' + data.mentionUser.map((user) => `<@${user}>`) : ''} **|** `
    } else if (typeof emoji === 'object') {
      str = Emoji.getEmoji(emoji.name)[emoji.type]
    }
    return `${str}${t}`
  }

}
