import { EventEmitter } from 'events'

export class Collector extends EventEmitter {
  constructor (filter, options) {
    super()

    this.filter = filter
    this.options = {
      max: options.max || 5,
      time: options.time || 30000
    }
    this.collected = []
    this.collectedSize = 0
    this.ended = false
    this._timeout = null
    this._idleTimeout = null
  }

  collect () { }

  async handleCollect (...args) {
    const collect = this.collect(...args)

    if (collect && (await this.filter(...args, this.collected))) {
      this.collected.push(collect)

      this.collectedSize += 1
      this.emit('collect', ...args)

      if (this._idletimeout) {
        clearTimeout(this._idletimeout)
        this._idletimeout = setTimeout(() => this.stop('idle'), this.options.idle)
      }
    }
    this.checkEnd()
  }

  endReason () {
    if (this.collectedSize >= this.options.max) return 'limit'
  }

  checkEnd () {
    const reason = this.endReason()
    if (reason) this.stop(reason)
  }

  stop (reason) {
    if (this.ended) return

    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout)
      this._idletimeout = null
    }

    this.ended = true

    this.emit('end', this.collected, reason)
  }
}
