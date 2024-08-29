import os from 'os-utils'
import path from 'path'
import { Worker } from 'worker_threads'
import { Logger } from '../../structures/util/Logger'

export class Manager {
  constructor() {
    this.clusterAmount = parseInt(process.env.CLUSTER_AMOUNT) || import('os').cpus().length || 6
    this.shardsPerCluster = Math.round(parseInt(process.env.SHARD_AMOUNT) / this.clusterAmount)
    this.aliveClusters = 0
    this.clusters = []

    if (process.env.PRODUCTION !== 'true') {
      Logger.info('The bot is running in development mode. Your console will get messy.')

      setInterval(() => {
        os.cpuUsage(function (u) {
          Logger.info(`Resource usage:\n Memory ${Math.round(os.freemem())}MB/${Math.round(os.totalmem()) / 1000}GB (${Math.round(os.freememPercentage())}% usage)\n CPU: ${u}% usage ${Math.round(os.loadavg(1))}% load avg/1m.`)
        })
      }, 60 * 1000)
    }
  }

  start() {
    Logger.info(`Spawning ${this.clusterAmount} clusters, each one with ${this.shardsPerCluster} ${this.shardsPerCluster === 1 ? 'shard' : 'shards'}.`)
    this.spawnClusters()
  }

  createCluster(id, env) {
    const worker = new Worker(path.resolve(import.meta.url + '/../', 'cluster.js'), {
      env: env ? { ...process.env, ...env } : {
        ...process.env,
        CLUSTER_ID: id,
        SHARDS_PER_CLUSTER: this.shardsPerCluster
      }
    })
    worker.on('exit', () => this.onExit(id))
    worker.on('error', (err) => this.onError(id, err))
    worker.on('message', (m) => this.onMessage(m))

    this.aliveClusters++
    return worker
  }

  spawnClusters() {
    this.clusters = new Array(this.clusterAmount).fill(0).map((_, i) => this.createCluster(i))
  }

  onExit(worker) {
    this.aliveClusters--
    Logger.error(`Mayday! Cluster ${worker} died! Starting another cluster now.`)
    this.clusters[typeof worker === 'number' ? worker : null] = this.createCluster(worker)
  }

  onError(id, error) {
    Logger.error(`Cluster ${id} returned an error: ${error.stack}`)
  }

  onMessage(m) {
    // our job here is simple: all we have to do is get the message recipient and send it to them.
    if (m.recipient === 'all') {
      this.clusters.forEach(c => c.postMessage(m))
    } else if (m.recipient === 'manager') { // hey, that's me!
      let rst
      try {
        // eslint-disable-next-line security/detect-eval-with-expression
        rst = { success: true, rst: eval(m.data) }
      } catch (e) {
        rst = { success: false, rst: e.stack }
      }

      this._send(m, rst)
    } else {
      this.clusters[parseInt(m.recipient)].postMessage(m)
    }
  }

  _send(m, rst, swi = true) {
    m.at = m.id
    m.data = rst
    if (swi) {
      const s = m.sender
      m.recipient = s
      m.sender = 'manager'
    }
    try {
      this.clusters[parseInt(m.recipient)].postMessage(m)
    } catch (e) {
      this.clusters[parseInt(m.recipient)].postMessage({ at: m.at, data: e.stack, recipient: m.recipient, sender: 'manager' })
    }
  }
}
