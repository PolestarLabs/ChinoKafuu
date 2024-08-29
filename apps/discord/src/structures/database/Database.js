import EventEmitter from 'events'
import mongoose from 'mongoose'
import IGuildCollection from '../interfaces/IGuildCollection'
import IUserCollection from '../interfaces/IUserCollection'
import { Logger } from '../util/Logger'
import { Collection } from './Collection'
import command from './collections/Command'
import guild from './collections/Guild'
import user from './collections/User'
import SearchCommandsData from './search/SearchCommandsData'
import SearchGuildsData from './search/SearchGuildsData'
import SearchUsersData from './search/SearchUsersData'

const defineSearchCollections = (property = {}) => {
  if (typeof property !== 'object') {
    property = {}
  }
  if (typeof property?.search !== 'object') {
    property.search = {
      guilds: [],
      users: [],
      commands: []
    }
  }
  if (typeof property?.search?.guilds === 'object' && !Array.isArray(property.search.guilds)) {
    property.search.guilds = []
  }
  if (typeof property?.search?.users === 'object' && !Array.isArray(property.search.users)) {
    property.search.users = []
  }
  if (typeof property?.search?.commands === 'object' && !Array.isArray(property.search.commands)) {
    property.search.commands = []
  }
}

// It is used to get only the response time, if the latency is high it is necessary to get faster analysis support to improve latency.
const traceLatency = (type, value, database) => {
  if (value > 150 && value > database.highLatency) {
    database.highLatency = value
    Logger.warning(`[MONGODB] Response from getting data of type  { type = ${type} }  has { value = ${value}ms } high latency.`)
  }
  return value
}

/**
 * @template T
 * @param {*} type
 * @param {T} data
 * @param {*} timestamp
 * @param {*} tracing
 * @param {*} database
 * @returns
 */
const query = (queries = 'unknown', type = 'unknown', data = [], timestamp = { original: 0, date: 0, latency: 0 }, tracing = {}, database) => ({
  queries: queries ?? 'unknown',
  typeQuery: type ?? 'unknown',
  data,
  tracing: {
    time: {
      ...timestamp,
      latency: traceLatency(type, (Date.now() - (timestamp.date <= 0 ? Date.now() : timestamp.date)), database)
    },
    ...tracing
  },
  get: (...args) => data.find(...args) ?? null,
  remove: (...args) => {
    const getData = data.indexOf(args)
    return data.splice(getData, 1)
  }
})
/**
 * @template T
 * @param {*} type
 * @param {T} data
 * @param {*} timestamp
 * @param {*} tracing
 * @param {*} database
 * @returns
 */
const dataQuery = (queries = 'unknown', type = 'unknown', data, timestamp = { original: 0, date: 0, latency: 0 }, tracing = {}, database) => ({
  queries: queries ?? 'unknown',
  typeQuery: type ?? 'unknown',
  data,
  tracing: {
    time: {
      ...timestamp,
      latency: traceLatency(type, (Date.now() - (timestamp.date <= 0 ? Date.now() : timestamp.date)), database)
    },
    ...tracing
  },
})

export class Database extends EventEmitter {
  constructor() {
    super()
    /**
     * @type {Collection<command>}
     */
    this.commands = new Collection(command)
    /**
     * @type {Collection<guild>}
     */
    this.guilds = new Collection(guild)
    /**
     * @type {Collection<user>}
     */
    this.users = new Collection(user)
    this.highLatency = 0
    this.researchers = {
      users: new SearchUsersData(this),
      guilds: new SearchGuildsData(this),
      commands: new SearchCommandsData(this)
    }
    this.#connect()
  }

  advancedDataSearchEngine() {
    return this.researchers
  }

  #connect() {
    if (process.env.DISCORD_MONGO_URI) {
      mongoose.set('strictQuery', true)
      mongoose.connect(process.env.DISCORD_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          this.emit('state', (false))
          return Logger.error(`Unable to connect to the database ${err}`)
        }
        this.emit('state', (true))
        Logger.debug('Connected to the database.')
      })
    }
  }

  /**
   * @param {'guilds' | 'users' | 'commands'} queries
   * @param {string} id
   * @param {string | null} defaultValues
   * @param {boolean} getOrCreate
   * @returns {Promise<IGuildCollection | IUserCollection | any | null>}
   */
  async #resolveData(queries = '', id = '', defaultValues = {}, getOrCreate = false) {
    if (queries === Queries.Guilds) {
      if (getOrCreate === true) {
        return this.guilds.getOrCreate(id ?? '', defaultValues ?? {}) ?? null
      }

      return this.guilds.findOneByID(id ?? '') ?? null
    } else if (queries === Queries.Users) {
      if (getOrCreate === true) {
        return this.users.getOrCreate(id ?? '', defaultValues ?? {}) ?? null
      }

      return this.users.findOneByID(id ?? '') ?? null
    } else if (queries === Queries.Commands) {
      if (getOrCreate === true) {
        return this.commands.getOrCreate(id ?? '', defaultValues ?? {}) ?? null
      }

      return this.commands.findOneByID(id ?? '') ?? null
    } if (typeof queries != 'string') {
      throw Error('You entered the queries invalidly.')
    }

    return null
  }

  async flux(data) {
    defineSearchCollections(data) // Define the property that is missing from the search.
    const trackTime = Date.now()
    const guildTimestamp = { original: Date.now(), date: Date.now() }
    const fetchDataGuild = async (id, defaultValues = {}, getOrCreate = false) =>
      dataQuery('guild', id, await this.#resolveData(Queries.Guilds, id, defaultValues, getOrCreate), guildTimestamp, {}, this)

    const userTimestamp = { original: Date.now(), date: Date.now() }
    const fetchDataUser = async (id, defaultValues = {}, getOrCreate = false) =>
      dataQuery('user', id, await this.#resolveData(Queries.Users, id, defaultValues, getOrCreate), userTimestamp, {}, this)

    const commandsTimestamp = { original: Date.now(), date: Date.now() }
    const fetchDataCommands = async (id, defaultValues = {}, getOrCreate = false) =>
      dataQuery('commands', id, await this.#resolveData(Queries.Commands, id, defaultValues, getOrCreate), commandsTimestamp, {}, this)

    const commandsTimestamps = { original: Date.now(), date: Date.now() }
    const commands = await Promise.all(
      data.search.guilds
        .filter((search) => typeof search.fetch.id === 'string')
        .filter((search) => typeof search.data === 'object')
        .map((search) => [search.fetch.id ?? '', search.data ?? {}, search.getOrCreate ?? false])
        .map(async ([id, defaultValues, getOrCreate]) => query('commands', id, await fetchDataCommands(id, defaultValues, getOrCreate), commandsTimestamps, {}, this))
    )

    const guildsTimestamp = { original: Date.now(), date: Date.now() }
    const guilds = await Promise.all(
      data.search.guilds
        .filter((search) => typeof search.fetch.id === 'string')
        .filter((search) => typeof search.data === 'object')
        .map((search) => [search.fetch.id ?? '', search.data ?? {}, search.getOrCreate ?? false])
        .map(async ([id, defaultValues, getOrCreate]) => query('guilds', id, await fetchDataGuild(id, defaultValues, getOrCreate), guildsTimestamp, {}, this))
    )
    const usersTimestamp = { original: Date.now(), date: Date.now(), latency: 0 }
    const users = await Promise.all(
      data.search.users
        .map((search) => [search.fetch.id ?? '', search.data ?? {}, search.getOrCreate ?? false])
        .map(async ([id, defaultValues, getOrCreate]) => query('users', id, await fetchDataUser(id, defaultValues, getOrCreate), usersTimestamp, {}, this))
    )

    const func = {
      data: { guilds, users, commands },
      time: {
        jitter: (Date.now() - trackTime) / 1000 ** 0.1,
        latency: Date.now() - trackTime
      },
      /**
       *
       * @param {'guilds' | 'users' | 'commands'} query
       * @param {*} mouse
       */
      getQuery: (query = '', mouse = (_) => null) => {
        const obj = [[Queries.Guilds, guilds], [Queries.Users, users], [Queries.Commands, commands]]
        const [_, getQueries] = obj.find(([id]) => id === query)
        const getData = getQueries.find(mouse)?.data ?? null
        return getData
      },
      /**
       *
       * @param {'guilds' | 'users' | 'commands'} query
       * @param {*} mouse
       */
      // eslint-disable-next-line no-unused-vars
      getQueryWithFilter: (query = '', mouse = (_) => null) => {
        const obj = [[Queries.Guilds, guilds], [Queries.Users, users], [Queries.Commands, commands]]
        // eslint-disable-next-line no-unused-vars
        const [_, getQueries] = obj.find(([id]) => id === query)
        const getData = getQueries.filter(mouse)?.data ?? null
        return getData
      },
      /**
      *
      * @param {'guilds' | 'users' | 'commands'} query
      * @param {*} mouse
      */
      getAllDataInQuery: (query = '') => {
        const obj = [[Queries.Guilds, guilds], [Queries.Users, users], [Queries.Commands, commands]]
        // eslint-disable-next-line no-unused-vars
        const [_, getQueries] = obj.find(([id]) => id === query)
        const getData = getQueries?.map((d) => d?.data ?? ({})) ?? []
        return getData
      }
    }
    return { ...func }
  }

}

export const Queries = {
  Users: 'users',
  Guilds: 'guilds',
  Commands: 'commands'
}
