/* eslint-disable no-unused-vars */
import axios from 'axios'
import { CommandDataOption, Interaction, Message } from 'eris'
import IGuildCollection from '../interfaces/IGuildCollection'
import IUserCollection from '../interfaces/IUserCollection'
import { Emoji } from '../util/EmotesInstance'
import { CommandContext } from './CommandContext'

/**
 * @typedef {object} Embed
 * @property {string} [title]
 * @property {string} [description]
 * @property {string | 'https://' | 'http://'} [url]
 * @property {string | Date} [timestamp]
 * @property {number} [color]
 * @property {{text?:string; icon_url?:string; proxy_icon_url?:string}[]} [footer]
 * @property {{url?: string | 'https://' | 'http://'; proxy_url: string | 'https://' | 'http://'; height?: number; width?: number}} [image]
 * @property {{url?: string | 'https://' | 'http://'; proxy_url: string | 'https://' | 'http://'; height?: number; width?: number}} [thumbnail]
 * @property {{name: string; url?: string; icon_url?: string | 'https://' | 'http://'; proxy_icon_url?: string | 'https://' | 'http://'}} [author]
 * @property {{name: string; value: string; inline?: boolean}[]} [fields]
 */

/**
 * @typedef {object} Button
 * @property {2} type
 * @property {1 | 2 | 3 | 4 | 5} style
 * @property {string} label
 * @property {{name?: string; id?: string}} [emoji]
 * @property {string} [custom_id]
 * @property {string} [url]
 * @property {boolean} [disabled]
 */

/**
 * @typedef {object} SelectMenu
 * @property {3 | 5 | 6 | 7 | 8} type
 * @property {string} custom_id
 * @property {{label: string; value: string; description?: string; emoji?: {id?: string | null; name?: string | null; animated?: boolean | null}; default?: boolean}} [options]
 * @property {0 | 1 | 2 | 3 | 4 | 5 | 10| 11| 12 | 13 | 14 | 15} [channel_types]
 * @property {string} [placeholder]
 * @property {number} [min_values]
 * @property {number} [max_values]
 * @property {boolean} [disabled]
 */

/**
 * @typedef {object} TextInput
 * @property {string} custom_id
 * @property {number} style
 * @property {string} label
 * @property {number} [min_length]
 * @property {number} [max_length]
 * @property {boolean} [required]
 * @property {string} [value]
 * @property {string} [placeholder]
 */

/**
 * @typedef {TextInput | Button | SelectMenu | {type: number}} ComponentMetadata
 */

/**
 * @typedef {object} MessageComponent
 * @property {string | null} [content]
 * @property {number | string} [nonce]
 * @property {boolean | null} [tts]
 * @property {Embed[] | null} [embeds]
 * @property {{parse?: 'roles' | 'users' | 'everyone'; roles?: string[]; users?: string[];replied_user?: boolean}} [allowed_mentions]
 * @property {{message_id?: string; channel_id?: string; guild_id?: string; fail_if_not_exists?: boolean}} [message_reference]
 * @property {{type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; components?: ComponentMetadata[]}[]} [components]
 * @property {{
 *     id: string;
 *     pack_id?: string;
 *     name: string;
 *     description: string | null;
 *     tags?: string; asset?:
 *     string type?: number;
 *     format_type: number;
 *     available?: number;
 *     guild_id: string;
 *     user?: any;
 *     sort_value?: number;
 * }} [sticker_ids]
 * @property {number} [flags]
 */

/**
 * @typedef {object} DBOptions
 * @property {IUserCollection} user
 * @property {IGuildCollection} guild
 * @property {import('mongoose').Model} db
 */

/**
 * @typedef {object} SlashCommandOptions
 * @property {Interaction} getInteraction
 * @property {Message} message
 * @property {string[]} args
 * @property {DBOptions} db
 * @property {[{title: ''}]} embeds
 */
/**
 * @class
 * @extends {CommandContext}
 */
export class SlashCommandContext extends CommandContext {
  /**
  * @constructor
  * @param {SlashCommandOptions} options
  * @property {Interaction} interaction
  * @property {Map<string, CommandDataOption>} args
  * @property {(args: 'commands:lang' | 'basic:lang' | 'events:lang' | 'permissions:lang'): string} _locale
  */
  constructor(bot, interaction, args, db, _locale, statsDB) {
    super(bot, interaction.message, args, db, _locale)
    /**
     * @type {Interaction}
     */
    this.getInteraction = interaction
    /**
     * @type {Message}
     */
    this.message = interaction
    /**
     * @type {Map<string, CommandDataOption>}
     */
    this.args = args
    /**
     * @type {DBOptions}
     */
    this.db = db
    this.embeds = []
    /**
     * @type {(args: 'commands:' | 'basic:' | 'events:' | 'permission:' | 'slashcommand:', placeholder: Object.<number, string | 'Text example.'>) => string}
     * @returns {string}
     */
    this._locale = _locale
    this.used = false
    this.content = {}
    this.deferMessage = null
    /**
     * @type {{jitter: number; latency: number;}}
     */
    this.statsDB = {
      jitter: statsDB?.jitter ?? 0,
      latency: statsDB?.latency ?? 0
    }
  }

  /**
   * ```js
   * ctx.createInteractionFunction('nameInteraction', message, {
   *    state,
   *    users: [ctx.message.author.id]
   * })
   * ```
   */
  createInteractionFunction(name, message, options) {
    this.interactionBase = this.client.interactionManager.createInteractionBase(message.id, -1, {
      expireUntil: 420 * 1000,
      name,
      ...options
    })
  }

  createInteractionModal(name, interactionId, options) {
    this.interactionBase = this.client.interactionManager.createInteractionModal(interactionId, 5, {
      expireUntil: 420 * 1000,
      name,
      isModal: true,
      ...options
    })
  }

  /**
   * Sends a message to this channel
   * @param {string} content The content to be sent
   * @param {string} props {object}
   * @returns {Promise<Eris.Message> | Promise<Eris.Message<Eris.TextableChannel>> | Promise<Eris.Message<Eris.TextChannel>> | Promise<Eris.Message<Eris.NewsChannel>> | Promise<Eris.Message<Eris.PrivateChannel>>}
   */
  async send(content, ...props) {

    if (content?.embeds !== undefined) {
      for (const embed of content.embeds) {
        this.embeds.push(embed)
      }
    }

    this.content = {
      content: (typeof content === 'string') ? content : content.content,
      embeds: this.embeds,
      flags: content.flags ?? 0,
      components: content.components ?? this.commandInteractions.component,
      options: props[0]?.options
    }

    if (this.content.options === undefined) {
      delete this.content.options
    }
    if (this.used) {
      const messageFunction = this.deferMessage.deferEdit(this.content, props[0]?.file, 6)
      this.deferMessage = messageFunction
      return messageFunction
    } else {
      this.used = true
      const messageFunction = this.message.hook.createMessage(this.content, props[0]?.file)
      this.deferMessage = messageFunction
      return messageFunction
    }
    // const messageFunction = this.message.hook.createMessage(this.content, props[0]?.file)
    // this.deferMessage = messageFunction
    // return messageFunction
  }

  /**
   *
   * @param {object} data
   * @param {Buffer} file
   * @returns {any}
   */
  async sendHook(data, file = null) {
    return this.client.interactionManager.hookInteraction({ id: this.getInteraction.id, token: this.getInteraction.token }, {
      type: 4,
      data: data,
    }, file)
  }

  /**
   *
   * @param {string} content
   * @param {{content: string, embeds: [], attachments: []}} data
   * @param {object} props
   * @returns {Promise<Eris.MessageInteraction>}
   */
  async sendT(content, data = {}, ...props) {
    return this.message.hook.createMessage({
      content: this._locale(content, data),
      components: this.commandInteractions.component,
      options: props[0]?.options
    }, props[0]?.file)
  }

  /**
   * Sends a message with the author mention and an emoji
   * @param {string} emoji The emoji of the message
   * @param {string | {content: string, components: [], options: any}} content The content to be sent
   * @param props
   * @returns {Promise<Eris.Message> | Promise<Eris.Message<Eris.TextableChannel>> | Promise<Eris.Message<Eris.TextChannel>> | Promise<Eris.Message<Eris.NewsChannel>> | Promise<Eris.Message<Eris.PrivateChannel>>}
   */
  async reply(emoji, obj, ...props) {
    const optionsMessage = typeof obj === 'string' ? {} : obj

    if (Array.isArray(props) && props[0]) {
      (typeof obj === 'string' ? null : (delete props[0].content))
    }

    return this.message.hook.createMessage({
      content: `${Emoji.getEmoji(emoji).mention} **》**<@${this.message.member.user.id}> ${typeof obj === 'string' ? obj : (obj.content ?? '')}`,
      components: this.commandInteractions.component,
      options: props[0]?.options,
      ...optionsMessage
    }, props[0]?.file)
  }

  /**
   *
   * @param {keyof Emojis | null} emoji
   * @param {string | MessageComponent | 'commands:' | 'basic:' | 'events:' | 'permission:' | 'slashcommand:'} content
   * @param {object} data
   * @param {any} props
   * @returns {Promise<Eris.MessageInteraction>}
   */
  async replyT(emoji, obj, data = {}, ...props) {
    if (data !== undefined && data.content !== undefined) {
      (typeof obj === 'string' ? null : (delete data.content))
    }
    return this.message.hook.createMessage({
      content: `${Emoji.getEmoji(emoji).mention} **》** <@${this.message.member.user.id}> ${this._locale(typeof obj === 'string' ? obj : (obj.content ?? ''), data)}`,
      components: props[0]?.components ?? this.commandInteractions.component,
      ...data,
      options: props[0]?.options
    }, props[0]?.file)
  }

  /**
   *
   * @param {string} args
   * @param {boolean} hasAuthor
   */
  async getUser(args, hasAuthor = false) {
    try {
      if (!args) {
        if (hasAuthor) {
          return await this.client.getRESTUser(this.message.author.id)
        }

        return undefined
      }

      const member = await this.client.getRESTUser(args.replace(/[<@!>]/g, ''))

      return member
    } catch {
      const member = this.message.guild.members.find((member) => member.username.toLowerCase().includes(args.toLowerCase())) || this.message.guild.members.find((member) => `@${member.username}`.toLowerCase() === args.toLowerCase())
      if (!member) {
        if (hasAuthor) {
          return await this.client.getRESTUser(this.message.author.id)
        }

        return undefined
      }

      return await this.client.getRESTUser(member.user.id)
    }
  }

  /**
   *
   * @param {string} args
   */

  async getEmoji(args) {
    if (!args) return undefined
    if (args.includes('%')) args = decodeURIComponent(args)
    if (!args.includes(':')) {
      const emoji = this.message.guild.emojis.find(emoji => emoji.id === args)
      if (emoji) {
        return {
          animated: emoji.animated,
          name: emoji.name,
          mention: `${emoji.animated ? '<a:' : '<:'}${emoji.name}:${emoji.id}>`,
          id: emoji.id,
          url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?v=1`
        }
      }

      try {
        if (await axios.get(`https://twemoji.maxcdn.com/2/72x72/${this.toUnicode(args).join('-')}.png`)) {
          return {
            animated: false,
            name: args,
            mention: args,
            id: this.toUnicode(args).join('-').toString(0),
            url: `https://twemoji.maxcdn.com/2/72x72/${this.toUnicode(args).join('-')}.png`
          }
        } else {
          return undefined
        }
      } catch {
        return undefined
      }
    }

    // eslint-disable-next-line security/detect-unsafe-regex
    const m = args.match(/<?(?:(a):)?(\w{2,32}):(\d{17,19})?>?/)
    if (!m) return undefined
    if (m[2] && !m[3]) return undefined

    return {
      animated: Boolean(m[1]),
      name: m[2],
      mention: `${m[1] ? '<a:' : '<:'}${m[2]}:${m[3]}>`,
      id: m[3],
      url: `https://cdn.discordapp.com/emojis/${m[3]}.${m[1] ? 'gif' : 'png'}?v=1`
    }
  }

  /**
   *
   * @param {string} text
   */

  toUnicode(text) {
    const emojis = []
    for (const codePoint of text) {
      emojis.push(codePoint.codePointAt(0).toString(16))
    }
    return emojis
  }

  getRole(role) {
    if (!role) return undefined
    const getRole = this.message.guild.roles.find(role => role.name.toLowerCase().includes(role.toLowerCase)) || this.message.guild.roles.get(role.replace(/[<@&>]/g, ''))
    if (!getRole) return undefined
    return getRole
  }

  getChannel(channel) {
    if (!channel) return undefined
    const getChannel = this.client.getChannel(channel.replace(/[<#>]/g, ''))
    if (!getChannel) return undefined

    return getChannel
  }

  async getMember(user) {
    if (!user) return undefined
    try {
      const member = this.message.guild.members.get(user.replace(/<@!>/g, ''))
      if (member) {
        return member
      } else {
        return await this.client.getRESTGuildMember(this.message.guild.id, user.replace(/<@!>/g, ''))
      }
    } catch {
      return undefined
    }
  }
}
