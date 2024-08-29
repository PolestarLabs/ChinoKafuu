import EventEmitter from 'events'
import { Logger } from '../../../../structures/util/Logger'

export class PluginExtend extends EventEmitter {
  constructor({ name, optionsExtend }) {
    super()
    this.args = optionsExtend?.args ?? null
    this.timeout = optionsExtend?.timeout ?? null
    this.name = name ?? `unknown-${Buffer.from(`${Math.floor(Math.random() * 100000000)}`).toString('base64')}-${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 100000000)}`
    this.loaded = false
    this.failed = false
    this.inactive = false
    this.classFound = null
    this.started = Date.now()
    this.$pluginManager = optionsExtend?.pluginManager ?? null
    this.logger = Logger

    // If you want to return something, use the method of addClassState()
    //
    this.classState = null

    // Soon I will work with this part of turning everyone into worker thread to make more efficient use of plugin work.
    //
    this.worker = null

    // When there is no response from the plugin, it is automatically inactive.
    //
    if (this.timeout !== null) {
      setTimeout(() => this.emit('discarded', ({ started: this.started, loaded: this.loaded, classState: this, time: Date.now() })), this.timeout)
    }

  }

  // Start function
  // eslint-disable-next-line no-unused-vars
  start({ options, env, pluginManager, $worker }) { }

  // this.$classState
  $addClassState({ data }) {
    this.classState = data
    return { data }
  }

  ready() {
    this.loaded = true
    this.emit('started', ({ started: this.started, loaded: this.loaded, classState: this, time: Date.now() }))
  }

  fail(_err) {
    this.loaded = true

    let err = null

    if (err !== undefined) {
      err = _err
    }

    this.emit('failed', ({ started: this.started, loaded: this.loaded, classState: this, time: Date.now(), error: err }))
  }
}
