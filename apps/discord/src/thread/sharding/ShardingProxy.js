import { Shard } from 'eris'
import EventEmitter from 'node:events'
import { WebSocket } from 'ws'

export class WebSocketWorker extends EventEmitter {
  constructor(worker, id) {
    super()
    /**
     * @type {import('node:worker_threads').Worker | null}
     */
    this.worker = worker
    /**
     * @type {number | null}
     */
    this.shardID = id
    this.readyState = WebSocket.OPEN
  }

  send(...args) {
    if (this.worker != null) {
      this.worker.postMessage({ type: 'websocketClient', data: { shardID: this.shardID, data: args } })
    }
  }
}

/**
 * @description
 */
export class ShardProxy extends Shard {
  constructor(thread, ...args) {
    super(...args)
    this.ws = new WebSocketWorker(thread, this.id)
    this.presence = {}
    this.ws.on('dataWorker', ({ packet }) => {
      this.wsEvent(packet)
      if (packet !== undefined && packet.t === 'READY') {
        if (this.client.ready) return
        this.client.ready = true
        this.client.emit('ready')
      }
    })
  }

  reconnectInterval() { }

  disconnect() { }

  connect() { }

  initializeWS() { }

  onPacket(packet) {
    if (this.listeners('rawWS').length > 0 || this.client.listeners('rawWS').length) {
      this.emit('rawWS', packet, this.id)
    }
  }

  resume() { }

  sendWS(...args) {
    this.ws.send(...args)
  }
}