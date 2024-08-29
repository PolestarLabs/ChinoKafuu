/**
 * @interface
 */
export default class IGuildCollection {
  /**
   * @type {string}
   */
  id

  /**
   * @type {string}
   */
  prefix

  /**
   * @type {string}
   */
  channelReport

  /**
   * @type {boolean}
   */
  reportModule

  /**
   * @type {string}
   */
  lang

  /**
   * @type {string}
   */
  punishChannel

  /**
   * @type {boolean}
   */
  punishModule

  /**
   * @type {boolean}
   */
  partner

  /**
   * @type {boolean}
   */
  animu

  /**
   * @type {number}
   */
  flags

  /**
   * @type {string}
   */
  animuChannel

  /**
   * @type {boolean}
   */
  blacklist

  /**
   * @type {string}
   */
  blacklistReason

  /**
   * @type {{roles: Array<string>, channels: Array<string>}}
   */
  allowedChannel

  /**
   * @type {{enabled: boolean, messagesLimit: number}}
   * @deprecated This field has been discontinued, there is no forecast or continuation or development for this field usage yet. That's why it was deprecated.
   * @since 0.0.0
   */
  antiflood

  save() {}
}