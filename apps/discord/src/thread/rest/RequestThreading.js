import { Client, RequestHandler } from 'eris'
import { Worker, isMainThread, parentPort } from 'node:worker_threads'
import { Logger } from '../../structures/util'

const defineTypeStatus = (data) => {
  if (data.time >= 100 || data.buckets <= 10) {
    return {
      status: 'LOW',
    }
  } else if (data.time >= 40 || data.buckets <= 90) {
    return {
      status: 'MEDIUM',
    }
  } else if (data.buckets <= 5) {
    return {
      status: 'LOW',
    }
  }

  return {
    status: 'HIGH',
  }
}
export class BotInstance extends Client {
  constructor() {
    super(process.env.DISCORD_TOKEN, {
      rest: {
        baseURL: '/api/v9',
        disableLatencyCompensation: true
      }
    })

    if (!isMainThread) {
      this.on('error', (error) => Logger.error(error))
      this.on('debug', (message) => {
        if (process.env.PRODUCTION === 'false') {
          Logger.debug(message)
        }
      })
      this.on('rawREST', (request) => {
        if (request?.file?.file !== undefined) {
          request.file = null
        }
        if (request.body !== undefined) {
          request.body = null
        }
      })
      this.on('warn', (message) => {
        Logger.warning(message)
      })
    }
  }
}

export class RequestThreading extends RequestHandler {
  constructor() {
    super(new BotInstance(), {
      baseURL: '/api/v10'
    })
  }

  async createRequest(data) {
    return new Promise((resolve) => {
      try {
        this.request(...(data.args))
          .then((requestData) => {
            parentPort.postMessage({ type: 'handlerRequest', data: { id: data.id, error: false, data: requestData } })
            data = null
            resolve(null)
          })
          .catch((err) => {
            parentPort.postMessage({ type: 'handlerRequest', data: { id: data.id, error: true, data: err } })
            data = null
          })
        resolve(null)
      } catch (err) {
        parentPort.postMessage({ type: 'handlerRequest', data: { id: data.id, error: true, data: err } })
        data = null
      }
    })
  }
}

export class RequestWorker {
  /**
    * @type {Worker[]}
    */
  #worker;

  #buckets;

  #moveThread;

  #time;

  #timeNow;

  #timeTotal;

  #status;

  /**
   * @type {{ threadId: number; activity: number }[]}
   */
  #stats;

  constructor(client, workers = []) {
    this.client = client
    this.#worker = Array.isArray(workers) ? workers : []
    this.#buckets = []
    this.#stats = []
    this.#moveThread = 0
    this.#time = null
    this.#timeNow = null
    this.#timeTotal = null
    this.started = false
    this.start = () => {
      if (this.started) return
      this.#init()
    }
    this.#status = {
      status: 'LOW'
    }
    this.#watch()
  }

  #watch() {
    setInterval(() => {
      if (this.#time != null && this.#timeNow != null) {
        if (this.#timeTotal == this.#timeNow - this.#time) return
        this.#timeTotal = this.#timeNow - this.#time
        this.#status = defineTypeStatus({ time: this.#timeNow - this.#time, buckets: this.#buckets.length })
      }
      // this.#stats
      //   .filter((worker, index) => index != 0 && (Date.now() - worker.activity) >= 60000)
      //   .map((workerStat) => {
      //     const thread = this.#worker.find((worker) => worker.threadId == workerStat.threadId)
      //     if (thread !== undefined) {
      //       thread.terminate()
      //     }
      //   })
    }, 100);
  }

  #init() {
    this.started = true
    for (const worker of this.#worker) {
      worker.on('message', ({ type, data: requestData }) => {
        if (type === 'handlerRequest') {
          let { id, data } = requestData
          const workerFunctionIndex = this.#buckets.findIndex((w) => w.id == id)
          if (workerFunctionIndex != undefined && workerFunctionIndex != -1) {
            const workerFunction = this.#buckets.find((w) => w.id == id)
            if (id === id && requestData.error == false) {
              workerFunction.resolve(data)
            } else if (requestData.error == true) {
              workerFunction.reject(data)
            }

            this.#buckets.splice(workerFunctionIndex, 1)
          }
          data = null
          id = null
        }

      })
    }
  }

  get getThreadsWorking() {
    return this.#worker.length
  }

  getThread() {
    let id = 0;
    if (process.env?.THREAD_REST_MODE === 'EACH_FOR_ITSELF') {
      this.#moveThread = (this.#moveThread + 1) % this.#worker.length
      id = this.#moveThread

      return id
    } else if (process.env?.THREAD_REST_MODE === 'RANDOM') {
      id = Math.floor(Math.random() * this.#worker.length)
      return this.#moveThread
    }
    id = Math.min(Math.max(Math.floor(Math.log(this.#buckets.length)), 0), this.#worker.length)
    return id
  }

  request(...args) {
    this.#time = this.#timeNow
    this.#timeNow = Date.now()
    const worker = this.#worker.at(this.getThread())
    return new Promise((resolve, reject) => {
      const genID = String(Math.floor(Math.random() * (1000000000000 * 10000000)))
      this.#buckets.push({ id: genID, resolve, reject, threads: 0 })
      worker.postMessage({ type: 'requestBot', data: { id: genID, args: args } })
    })
  }
}
