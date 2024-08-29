/* eslint-disable no-case-declarations */
import { parentPort } from 'worker_threads'

export class ClusteringInterface {
  constructor(client) {
    this.client = client
    this.tba = new Map()

    parentPort.on('message', (m) => this._handleMessage(m))
  }

  _getPingData(off) {
    const d = {}
    const onlineShards = !off ? this.client.shards.filter(a => a.latency !== Infinity) : []
    d.onlineShards = !off ? onlineShards.length : 0
    d.avgPing = !off ? (onlineShards.map(x => x.latency).reduce((r, o) => r += o, 0) / onlineShards.length) : 1000000
    const percentOn = !off ? (onlineShards.length / parseInt(process.env.SHARDS_PER_CLUSTER) * 100) : 0
    d.percentOn = percentOn
    if (percentOn >= 80) d.status = 'operational'
    if (percentOn <= 79 || d.avgPing > 450) d.status = 'unstable'
    if (percentOn <= 20 || d.avgPing > 1000) d.status = 'unoperational'
    if (off) d.status = 'clusterdown'
    return d
  }

  async getAveragePing() {
    return this.padMissingClusters(await this.send('all', 'eval', 'this._getPingData()'), this._getPingData(true))
      .map(({ cluster, result }) => {
        return { id: cluster, ...result }
      }).sort((a, b) => a.id - b.id)
  }

  padMissingClusters(array, val = {}) {
    if (array.length === parseInt(process.env.CLUSTER_AMOUNT)) return array
    return new Array(parseInt(process.env.CLUSTER_AMOUNT)).fill(val).map((v, i) => {
      if (array.filter(a => a.cluster === i)[0]) return array.filter(a => a.cluster === i)[0]
      return { cluster: i, result: v }
    })
  }

  send(recp, t, d) {
    return new Promise((call) => {
      let c = 0
      const q = []

      const on = (m) => {
        if (m) q.push(m)
        c++
        if ((recp === 'all' && c === parseInt(process.env.CLUSTER_AMOUNT)) || (recp !== 'all' && c > 0)) call(q)
      }

      this._send(null, t, d, recp, (m) => on(m))
    })
  }

  _handleMessage(m) {
    if (m.at) return this._handleAnswer(m)

    switch (m.type) {
      case 'eval':
        let rst
        try {
          // eslint-disable-next-line security/detect-eval-with-expression
          rst = { success: true, rst: eval(m.data) }
        } catch (e) {
          rst = { sucess: false, rst: e.stack }
        }

        this._send(m, 'eval', rst)
    }
  }

  _handleAnswer(m) {
    const data = this.tba.get(m.at)
    if (!data) return // guess they weren't talking to us?

    try {
      data.f({ cluster: m.sender !== 'manager' ? parseInt(m.sender) : 'manager', result: m.data?.rst || m.data })
      // eslint-disable-next-line no-empty
    } catch (_) { }
    if (m.all && data.answers + 1 !== parseInt(process.env.CLUSTER_AMOUNT)) {
      this.tba.set(m.at, { f: data.f, answers: data.answers + 1 })
    } else {
      this.tba.delete(m.at)
    }
  }

  _send(m, type, data, recipient, callback) {
    /*
      recipient/sender logic (> in, < out)

      > 3a7hw sender: 0, recipient: all
      < 3a7hw sender: 1, recipient: 0, all: true
      < 3a7hw sender: 2, recipient: 0, all: true
    */
    const payload = {
      data,
      recipient: recipient || m?.sender,
      sender: process.env.CLUSTER_ID,
      type,
      id: this._generateID()
    }
    if (m && m.recipient === 'all') payload.all = true
    if (m && m.id) { // if this cluster is answering to a certain request made by another cluster
      payload.at = m.id
    } else {
      // we're the ones making the request, this means that we'll have to store
      // the communication id and wait till we get an answer.
      this.tba.set(payload.id, { f: callback, answers: 0 })

      // if we don't get an answer in (timeout time defined || 30) seconds, delete the saved callback. we're not gettin anything back 💀
      setTimeout(() => {
        const d = this.tba.get(payload.id)
        if (!d || d.answers === process.env.CLUSTER_AMOUNT) return // everyone answered, yay
        this.tba.delete(payload.id)
        new Array(process.env.CLUSTER_AMOUNT - d.answers).fill(0).forEach(() => d.f())
      }, process.env.CLUSTER_MESSAGE_TIMEOUT || 30 * 1000)
    }
    if (payload.recipient === process.env.CLUSTER_ID) return this._handleMessage(payload)

    try {
      parentPort.postMessage(payload)
    } catch (e) {
      payload.data = e.stack
      parentPort.postMessage(payload)
    }
  }

  _generateID() {
    return Date.now() + Math.random().toString(36).substring(7)
  }

  get firstShardID() {
    if (process.env.CLUSTER_ID === '0') return 0
    return parseInt(process.env.CLUSTER_ID) * parseInt(process.env.SHARDS_PER_CLUSTER)
  }
}
