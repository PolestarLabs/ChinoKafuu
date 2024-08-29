import chalk from 'chalk'
import { Client, Collection } from 'eris'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import { Logger } from '../structures/util/index'
import { RequestThreading, RequestWorker } from './rest/RequestThreading'
import { ShardThread } from './sharding/ShardThreadService'
import { ShardProxy } from './sharding/ShardingProxy'
const events = ['shardResume', 'shardDisconnect', 'connect', 'disconnect']
export class ResourceThreads {
  /**
   * @type {WorkerBot}
   */
  #client

  /**
   @type {Worker[]}
  */
  #worker

  #check

  constructor(client) {
    this.#client = client
    this.#worker = []
    this.requestHandler = new RequestWorker(client, this.getWorker)
    this.#check = []
    this.#init()
    if (this.maxThread <= 0) {
      Logger.warning(chalk.bold('Thread was disabled because you provided an amount less and therefore it cannot be enabled, check in /.env and in the field "MAX_THREAD"'))
    } else {
      if (this.checkResource('request') && this.checkResource('ws')) {
        Logger.info('All Eris library resources were directed to Thread.')
      } else {
        Logger.info(`Features enabled and directed to Threads: ${this.getResources.join(', ')}`)
      }
    }

  }

  /**
   *
   * @param {'request' | 'ws'} name
   * @returns
   */
  checkResource(name = '') {
    return (process.env?.THREAD_RESOURCES ?? '')
      .replace(/(,\s+|\s+,)/, '')
      .includes(typeof name === 'string' ? name.toUpperCase() : '')
  }

  get getResources() {
    return (process.env?.THREAD_RESOURCES ?? '')
      .replace(/(,\s+)/g, '')
      .split(',')
      .map((str) => str.replace(/(^\s+|\s+$)/, ''))
      .filter((str) => ['WS', 'REQUEST'].includes(str.toUpperCase()))
      .filter((str) => str.length >= 1)
  }

  nameOfThread(name = null, index = null) {
    return (process.env?.THREAD_NAME ?? '')
      .replace(/(,\s+)/g, '')
      .split(',')
      .map((str) => str.replace(/(^\s+|\s+$)/, ''))
      .filter((str) => str.length > 0)
      .filter((str) => str == (typeof name === 'string' ? name : str))
      .filter((str) => str != ',' || str != ' ')
      .find((str, i) => typeof name === 'string' ? name == str : i == index) ?? null
  }

  get lengthResources() {
    return (process.env?.THREAD_RESOURCES ?? '')
      .replace(/(,\s+)/g, '')
      .split(',')
      .map((str) => str.replace(/(^\s+|\s+$)/, ''))
      .filter((str) => ['WS', 'REQUEST'].includes(str.toUpperCase()))
      .filter((str) => str.length >= 1)
  }

  get maxThreadRest() {
    return (Number(process.env?.MAX_THREAD_REST) ?? 0)
  }

  get maxThread() {
    return (Number(process.env?.MAX_THREAD) ?? 0)
  }

  get getWorker() {
    return this.#worker
  }

  async connect() {
    if (this.lengthResources.length == 0) {
      return
    }
    await (this.#client.options.maxShards === 'auto' ? this.#client.getBotGateway() : this.#client.getGateway())
    const awaitThread = (thread) => new Promise((resolve) => {
      thread.once('shardOk', () => resolve())
    })
    return new Promise((resolve) => {
      const start = async () => {
        for (const shard of this.#worker) {
          shard.postMessage({ type: 'websocketConnect' })
          await awaitThread(shard)
        }
        resolve()
      }
      start()
      this.#watch()
    })
  }

  async #watch() {
    setTimeout(() => {
      this.#worker.map((worker) => worker.postMessage({ type: 'shardsInfo' }))
    }, 500)
  }

  async #init() {
    if (this.lengthResources.length == 0) {
      return
    }
    const maxThread = Number(process.env.MAX_THREAD ?? 3)
    const sizeShard = Number(process.env.SHARD_AMOUNT ?? 1)
    let status = false
    let shardProxyCreated = false
    if (Number(process.env.SHARD_AMOUNT) > 1) status = true
    for (let i = 0; i < maxThread; i++) {
      const create = () => {
        const typeShard = status ? true : !(i > 0)
        const options = {
          name: `Thread(${this.nameOfThread(null, i) ?? 'None'}) = ${i}`,
          shardLimit: Number(process.env.SHARD_AMOUNT) > 1 ?
            Math.min((i + 1) * Math.round(sizeShard / maxThread), Number(process.env.SHARD_AMOUNT)) : 1,
          shardIn: typeShard ? i * Math.floor(sizeShard / maxThread) : 9999999,
          shardTo: Number(sizeShard),
          id: i
        }
        const threadWorker = new Worker('./src/thread/ResourceThreads.js', {
          eval: false,
          name: `Thread = ${i}`,
          workerData: options,
          resourceLimits: {
            maxYoungGenerationSizeMb: 1024 * 9009990,
          },
          argv: [process.argv.find((arg) => arg === '--loggerDev') ?? '']
        })
        if (this.checkResource('ws') && shardProxyCreated == false) {
          if (!(options.shardIn >= sizeShard)) {
            for (let i = options.shardIn; i < options.shardLimit; i++) {
              this.#client.shards.add(new ShardProxy(threadWorker, i, this.#client))
            }
          }
        }
        threadWorker.once('exit', (code) => {
          if (code != 1) {
            Logger.error(`Rest Thread ${i} died, restarting back to the queue. Code: ${code}`)
            this.#worker.splice(this.#worker.findIndex((thread) => thread.threadId == threadWorker.threadId), 1)
            this.#worker.push(create())
          }
        })
        threadWorker.on('message', (data) => {
          if (process.env.THREAD === 'true') {
            if (data.type === 'shardSpawn') {
              return
            } else if (data.type == 'websocketMessage') {
              this.#client.shards.get(data.id).ws.emit('dataWorker', data.data)
            } else if (data.type == 'shardEvent') {
              if (events.includes(data.event)) {
                this.#client.emit(data.event, ...(data.data))
                return
              }
              if (typeof data.id === 'number') {
                const shard = this.#client.shards.get(data.id)
                if (shard !== undefined) {

                  shard.emit(data.event, ...(data.data))
                }
              }
            } else if (data.type === 'shardOk') {
              threadWorker.emit('shardOk')
            } else if (data.type === 'shardInfo') {
              if (Array.isArray(data.metadata)) {
                for (const metadata of data.metadata) {
                  const getShard = this.#client.shards.find((shard) => shard.id == metadata.id) ?? null
                  if (getShard !== null) {
                    Object.assign(getShard, {
                      ...getShard,
                      latency: metadata.data.latency,
                      status: metadata.data.status,
                      lastHeartbeatAck: metadata.data.lastHeartbeatAck,
                      lastHeartbeatReceived: metadata.data.lastHeartbeatReceived,
                      lastHeartbeatSent: metadata.data.lastHeartbeatSent,
                      connecting: metadata.data.connecting,
                      discordServerTrace: metadata.data.discordServerTrace,
                      messagePerSecond: metadata?.messagePerSecond ?? Infinity,
                      sendPerSecond: metadata?.sendPerSecond ?? Infinity,
                      lastSendPerSecond: metadata?.lastSendPerSecond ?? Infinity,
                      lastMessagePerSecond: metadata?.lastMessagePerSecond ?? Infinity,
                    })
                  }
                }
              }

            } else if (data.type === 'stats') {
              threadWorker.stats = data.data ?? null
            } else if (data.type === 'shardPreReady') {
              if (data.id) {
                const shard = this.#client.shards.get(data.id)
                if (shard !== undefined) {
                  shard.emit('shardPreReady', ...(data.data))
                }
              }
            }
          }
        })
        return threadWorker
      }
      this.#worker.push(create())
    }
    shardProxyCreated = true
    this.requestHandler.start()
  }
}

export class WorkerEndToEnd {
  /**
    @type {WorkerBot}
  */
  client

  constructor(client) {
    this.client = client
    const sendReport = () => {
      return this.client.shards.map((shard) => ({
        type: 'shardInfo',
        id: shard.id,
        data: {
          latency: shard.latency,
          status: shard.status,
          lastHeartbeatAck: shard.lastHeartbeatAck,
          lastHeartbeatReceived: shard.lastHeartbeatReceived,
          lastHeartbeatSent: shard.lastHeartbeatSent,
          connecting: shard.connecting,
          discordServerTrace: shard.discordServerTrace,
          messagePerSecond: shard?.messagePerSecond ?? Infinity,
          sendPerSecond: shard?.sendPerSecond ?? Infinity,
          lastSendPerSecond: shard?.lastSendPerSecond ?? Infinity,
          lastMessagePerSecond: shard?.lastMessagePerSecond ?? Infinity,
        }
      }))
    }
    this.client
      .on('debug', (data) => Logger.debug(data))
      .on('shardReady', (id) => parentPort.postMessage({ type: 'shardEvent', event: 'shardReady', id: id, data: [id, workerData.id] }))
      .on('rawWS', (packet, id) => { parentPort.postMessage({ type: 'shardEvent', event: 'rawWS', id: id, data: [packet, id, workerData.id] }) })
      .on('shardResume', (id) => parentPort.postMessage({ type: 'shardEvent', event: 'shardResume', id: id, data: [id, workerData.id] }))
      .on('shardDisconnect', (err, id) => parentPort.postMessage({ type: 'shardEvent', event: 'shardDisconnect', id: id, data: [err, id, workerData.id] }))
      .on('shardPreReady', (id) => parentPort.postMessage({ type: 'shardPreReady', event: 'shardPreReady', id: id, data: [id, workerData.id] }))
      .on('connect', (id) => parentPort.postMessage({ type: 'shardEvent', event: 'connect', id: id, data: [id, workerData.id] }))
      .on('disconnect', () => parentPort.postMessage({ type: 'shardEvent', event: 'disconnect', id: null, data: [workerData.id] }))
    parentPort.on('message', async (data) => {
      try {
        if (this.client.interval - Date.now() <= 0 || this.client.interval == null) {
          const memoryInfo = process.memoryUsage()
          const cpuInfo = process.cpuUsage()
          const constrainedMemory = process.constrainedMemory()
          const resourceUsage = process.resourceUsage()
          parentPort.postMessage({
            type: 'stats',
            data: {
              memoryUsage: memoryInfo,
              cpuUsage: cpuInfo,
              constrainedMemory,
              resourceUsage
            }
          })
          this.client.interval = Date.now() + (2 * 1000)
        }
        if (data.type === 'requestBot') {
          await this.client.requestHandler.createRequest(data.data).catch(() => { })
        } else if (data.type === 'websocketConnect') {
          await this.client.spawnShards()
        } else if (data.type === 'websocketClient') {
          if (this.client.shards.get(data.data.shardID) !== undefined) {
            const getShard = this.client.shards.get(data.data.shardID)
            if (getShard !== undefined) {
              getShard.sendPerSecond = Date.now()
              getShard.lastSendPerSecond = getShard.sendPerSecond
            }
            getShard.sendWS(...(data.data.data))
          }
        } else if (data.type === 'shardsInfo') {
          sendReport()
        }
      } catch (err) {
        console.error(err)
      }
    })
  }
}

export class WorkerCollection extends Collection {
  #client

  constructor(client, type, ...options) {
    super(...options)
    this.#client = client
    this.type = type
  }

  add() { }

  update() { }

}

export class WorkerBot extends Client {
  constructor() {
    super(process.env.DISCORD_TOKEN, {
      rest: {
        baseURL: '/api/v10',
        disableLatencyCompensation: true
      },
      lastShardID: workerData.shardTo,
      maxShards: workerData.shardTo,
      compress: true,
      defaultImageFormat: 'png',
      defaultImageSize: 2048,
      restMode: true,
      ws: {
        protocolVersion: 13,
        perMessageDeflate: true,
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Sec-WebSocket-Extensions': 'permessage-deflate client_max_window_bits'
        },
      },
      allowedMentions: {
        everyone: false,
        roles: false,
        users: true,
        repliedUser: true
      },
      intents: 14079
    })
    this.interval = null
    this.groupChannels = new WorkerCollection(this, 'GroupChannels')
    this.guilds = new WorkerCollection(this, 'Guilds')
    this.privateChannels = new WorkerCollection(this, 'PrivateChannels')
    this.relationships = new WorkerCollection(this, 'RelativeShips')
    this.unavailableGuilds = new WorkerCollection(this, 'UnavailableGuilds')
    this.workerEndToEnd = new WorkerEndToEnd(this)
    this.requestHandler = new RequestThreading()
    if (!isMainThread) {
      this.on('error', (error) => console.error(error))
      this.on('rawREST', (request) => {
        if (request?.file?.file !== undefined) {
          request.file = null
        }
        if (request.body !== undefined) {
          request.body = null
        }
      })
      this.once('ready', () => parentPort.postMessage({ type: 'shardOk' }))
      this.on('warn', (message) => {
        Logger.warning(message)
      })
      const sendReport = () => {
        return this.shards.map((shard) => ({
          type: 'shardInfo',
          id: shard.id,
          data: {
            latency: shard.latency,
            status: shard.status,
            lastHeartbeatAck: shard.lastHeartbeatAck,
            lastHeartbeatReceived: shard.lastHeartbeatReceived,
            lastHeartbeatSent: shard.lastHeartbeatSent,
            connecting: shard.connecting,
            discordServerTrace: shard.discordServerTrace,
            messagePerSecond: shard?.messagePerSecond ?? Infinity,
            sendPerSecond: shard?.sendPerSecond ?? Infinity,
            lastSendPerSecond: shard?.lastSendPerSecond ?? Infinity,
            lastMessagePerSecond: shard?.lastMessagePerSecond ?? Infinity,
          }
        }))
      }
      this.on('hello', () => sendReport())
        .once('ready', () => sendReport())
        .on('resume', () => sendReport())
        .on('shardPreReady', () => sendReport())
        .on('disconnect', () => sendReport())
        .on('connect', () => sendReport())
        .on('rawWS', (packet, id) => {
          const getShard = this.shards.get(id)
          if (getShard !== undefined) {
            getShard.messagePerSecond = Date.now()
            getShard.lastMessagePerSecond = getShard.messagePerSecond
          }
          switch (packet.t) {
            case 'HEARTBEAT':
            case 'IDENTIFY':
            case 'RESUME':
            case 'RECONNECT':
            case 'INVALID_SESSION':
            case 'HELLO':
            case 'HEARTBEAT_ACK':
            case 'READY':
              parentPort.postMessage({ type: 'shardInfo', metadata: sendReport() })
              return
            default:
          }
          if (packet.op == 11) {
            parentPort.postMessage({ type: 'shardInfo', metadata: sendReport() })
          } else if (packet.op == 1) {
            parentPort.postMessage({ type: 'shardInfo', metadata: sendReport() })
          } else if (packet.op == 10) {
            parentPort.postMessage({ type: 'shardInfo', metadata: sendReport() })
          }
        })
    }
  }

  async spawnShards() {
    if (this.options.firstShardID >= this.options.maxShards) return
    const data = await (this.options.maxShards === 'auto' ? this.getBotGateway() : this.getGateway())
    if (!data.url || (this.options.maxShards === 'auto' && !data.shards)) {
      throw new Error('Invalid response from gateway REST call')
    }
    if (data.url.includes('?')) {
      data.url = data.url.substring(0, data.url.indexOf('?'))
    }
    if (!data.url.endsWith('/')) {
      data.url += '/'
    }
    this.gatewayURL = `${data.url}?v=${10}&encoding=${'json'}`

    if (this.options.compress) {
      this.gatewayURL += '&compress=zlib-stream'
    }
    for (let i = workerData.shardIn; i < workerData.shardLimit; i++) {
      const shard = new ShardThread(i, this)

      this.shards.add(shard)
    }

    await this.shards.map((shard) => this.shards.connect(shard))
  }
}

if (!isMainThread) (() => new WorkerBot())()