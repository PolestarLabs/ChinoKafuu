/**
 * @interface
 * @name IUserCollection
 */
export default class IUserCollection {
  /**
  * @type {string}
  */
  id

  /**
  * @type {number}
  */
  yens

  /**
  * @type {number}
  */
  timeDaily

  /**
  * @type {number}
  */
  sugarcube

  /**
  * @type {boolean}
  */
  afk

  /**
  * @type {string | null}
  */
  afkReason

  /**
  * @type {boolean}
  */
  blacklist

  /**
  * @type {string | null}
  */
  blacklistReason

  /**
  * @type {string}
  */
  aboutme

  /**
  * @type {string}
  */
  profileColor

  /**
  * @type {boolean}
  */
  isMarry

  /**
  * @type {string}
  */
  marryWith

  /**
  * @type {number}
  */
  backgrounds

  /**
  * @type {number}
  */
  profiles

  /**
  * @type {number}
  */
  flags

  /**
  * @type {number}
  */
  rep

  /**
  * @type {number}
  */
  reptime

  /**
  * @type {string | null}
  */
  shipValue

  /**
  * @type {{job: number}}
  */
  lastUpdates

  /**
  * @type {string}
  */
  background

  /**
  * @type {string}
  */
  sticker

  /**
  * @type {string}
  */
  profileType

  /**
  * @type {string}
  */
  backgroundList

  /**
  * @type {string}
  */
  profileList

  /**
  * @type {string}
  */
  stopNotify

  /**
  * @type {{bank: number, value: number, work: {job: number, arrested: boolean}}}
  */
  economy

  /**
  * @type {{job_interval: number, rob_interval: number, arrested_interval: number}}
  */
  intervals

  /**
   *@type {(): void}
   */
  save() { }
}
