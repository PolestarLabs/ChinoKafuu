import { Client } from 'eris'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Manager } from 'sirius'
import { getConfigLavalink } from '../lavalink'
import { ResourceThreads } from '../thread/ResourceThreads'
import { InteractionManager } from './InteractionManager'
import { CommandCooldown } from './command/CommandCooldown'
import { CommandRegistry } from './command/CommandRegistry'
import { SlashCommandRegistry } from './command/SlashCommandRegistry'
import { Database } from './database/Database'
import { ListenerRegistry } from './events/ListenerRegistry'
import { I18NRegistry } from './i18n/I18NRegistry'
import { InteractionFunctionRegistry } from './othersRegistry/InteractionFunctionRegistry'
import { ClusteringInterface } from './util/ClusteringInterface'
import { PlayerManager } from '../lavalink/PlayerManager'
// const CacheManager = require('./util/cache/CacheManager')

/**
 * @typedef SubCommandGlobalUi
 * @property {number} type
 * @property {string} name
 * @property {description} description
 * @property {boolean?} required
 * @property {boolean?} autocomplete
 */

/**
 * @typedef CommandGlobalUi
 * @property {string} name
 * @property {string} id
 * @property {boolean  | null | undefined} dm_permission
 * @property {boolean  | null | undefined} default_permission
 * @property {SubCommandGlobalUi[] | null | undefined} options
 * @property {boolean  | null | undefined} nsfw
 * @property {string} version
 */

export class Bot extends Client {
  /**
   * @type {ResourceThreads}
   */
  #threads

  constructor(...data) {
    super(...data)

    if (process.env?.THREAD === 'true') {
      this.#threads = new ResourceThreads(this)
    } else {
      this.#threads = null
    }
    if ((this.#threads != null && this.#threads.checkResource('request')) && this.#threads.maxThread > 0) {
      this.requestHandler = this.#threads.requestHandler
    }

    this.startShard = 0
    /**
    *
    * @type {ListenerRegistry}
    */
    this.listenerRegistry = new ListenerRegistry(this)
    /**
    *
    * @type {I18NRegistry}
    */
    this.i18nRegistry = new I18NRegistry()
    /**
    *
    * @type {CommandRegistry}
    */
    this.commandRegistry = new CommandRegistry()
    /**
     *
     * @type {SlashCommandRegistry}
     */
    this.slashCommandRegistry = new SlashCommandRegistry()
    /**
     * @type {InteractionFunctionRegistry}
     */
    this.interactionRegistry = new InteractionFunctionRegistry()
    /**
    *
    * @type {ClusteringInterface}
    */
    if (process.env.CLUSTERS === 'true') {
      this.clusters = new ClusteringInterface(this)
    } else {
      this.clusters = null
    }
    /**
    *
    * @type {Database}
    */
    /**
    *
    * @type {Map}
    */
    this.shardUptime = new Map()

    /**
    * @type {CommandCooldown}
    * @description This class is for blocking access to commands globally and Soon will have future implementations
    */
    this.commandCooldown = new CommandCooldown()
    /**
    * @description Perhaps this will be deprecated or will be used very soon by a repository rewrite.
    */
    //this.interactionPost = new InteractionManagerHttp(this)
    /**
     * @description To manage Bot interactions. Not just commands, it can manage buttons and menu and modal selection
     */
    this.interactionManager = new InteractionManager(this)
    /**
     * @description
     * @type {CommandGlobalUi[]}
     */
    this.commands = []
    if ((this.#threads != null && this.#threads.checkResource('ws')) && this.#threads.maxThread > 0) {
      this.connect = process.env.THREAD === 'true' ? this.#threads.connect.bind(this.#threads) : this.connect.bind(this)
    }
    this.playerManager = new PlayerManager(this)
  }

  get threadIsEnabled() {
    return (process.env?.THREAD == 'true' && this.#threads != null) && this.#threads.maxThread > 0
  }

  getNameOfThread(...args) {
    if (this.threadIsEnabled == false) throw new Error('Thread is disabled in /.env')
    return this.#threads.nameOfThread(...args)
  }

  get getThreadsSize() {
    if (this.threadIsEnabled == false) throw new Error('Thread is disabled in /.env')
    return this.#threads.getWorker.length
  }

  getShardsByThreads() {
    if (this.threadIsEnabled == false) return []
    const threads = []
    for (const worker of this.#threads.getWorker) {
      threads.push({ threadActive: worker, shards: this.shards.filter((shard) => shard.ws.worker.threadId == worker.threadId) })
    }
    return threads
  }

  loadDatabase() {
    if (this.database === undefined) {
      this.database = new Database()
    }
  }

  get getResourceThread() {
    if (this.threadIsEnabled == false) throw new Error('Thread is disabled in /.env')
    return this.#threads.getResources
  }
}
