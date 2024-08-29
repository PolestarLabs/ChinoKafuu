/* eslint-disable no-unused-vars */
import { CommandBase } from 'eris'
import { Module } from '../registry/Module'
import { SlashCommandContext } from './SlashCommandContext'

export { SlashCommandContext }

/**
 * @typedef {object} CommandOptions
 * @property {string} name
 * @property {string[]} [aliases]
 * @property {string[]} [permissions]
 * @property {boolean} [isBeta]
 * @property {number} [cooldown]
 * @property {CommandBase} [slash]
 * @property {boolean} [removeDefaultCallback]
 * @property {object} [callback_metadata]
 * @property {any} [modal]
 * @property {boolean} [isCommandModal]
 * @property {{jitter: number; lantecy: number;}} statsDB
 */

/**
 * @class Command
 * @extends Module
 */
export class Command extends Module {
  /**
   * @constructor
   * @param {CommandOptions} options
   */
  constructor(options) {
    super()
    this.name = options.name
    this.aliases = options.aliases || []
    this.permissions = options.permissions || []
    this.isBeta = options.isBeta || false
    this.cooldown = options.cooldown || 5
    this.slash = options.slash || null
    this.removeDefaultCallback = options.removeDefaultCallback || false
    this.callback_metadata = {}
    this.modal = options.modal || null
    this.isCommandModal = options.isCommandModal || false
    this.isBase = options.isBase || false
    this.statsDB = {
      jitter: 0,
      latency: 0
    }
  }

  // This is done to return the interaction data so when the user will execute the command automatically the function will be executed.
  // eslint-disable-next-line no-unused-vars
  callback(interaction) { }

  // eslint-disable-next-line no-unused-vars
  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  run(ctx) { }

  setModal() { }
}
