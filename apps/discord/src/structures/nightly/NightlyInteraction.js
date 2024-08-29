import { Message } from 'eris'
import { InteractionPacket } from '../interactions/InteractionPacket'
import { NightlyDeveloper } from './Nightly'

export class NightlyInteraction extends NightlyDeveloper {
  constructor(message, options) {
    super()
    this.options = options === undefined ? options : {}
    this.timeoutRun = null
    if (this.options?.time !== undefined) {
      this.timeoutRun = setTimeout(() => this.timeoutInteraction(), this.options.time)
    }
    this.timeout = false
    this.id = ''
    this.token = ''
    this.data = null
    this.isHttp = false
    this.interactionPost = null
    this.message = message
    this.client = message.channel.client
    this.typeInteraction = 1
    this.user = message.member.user
    if (this.client.interactionPost.connected) {
      this.client.on('interactionCreate', (a, isHttp, interactionPost) => this.interactionHttp(a, isHttp, interactionPost))
    } else {
      this.client.on('rawWS', (packet) => this.interactionNormal(packet))
    }
    this.on('click', () => {
      this.resetTimeout()
    })
  }

  resetTimeout() {
    clearTimeout(this.timeoutRun)
    this.timeoutRun = null
    if (this.options?.time !== undefined) {
      this.timeoutRun = setTimeout(() => this.timeoutInteraction(), this.options.time)
    }
  }

  timeoutInteraction() {
    this.emit('timeout', this, true, this.timeoutRun)
    this.timeout = true
    clearTimeout(this.timeoutRun)
    this.timeoutRun = null
  }

  interactionNormal(packet) {
    if (packet.t === 'INTERACTION_CREATE') {
      if (packet.d.type === 3) {
        if (this.message.id === packet.d.message.id) {
          if (packet.d.isHttp !== undefined) {
            this.data = packet.d
          }
          this.token = packet.d.token
          this.id = packet.d.id
          this.emit('collect', ({
            messageCollect: new Message(packet.d.message, this.client),
            interaction: new InteractionPacket(packet.d),
            packet: packet,
          }))
        }
      }
    }
  }

  /**
   * @deprecated Immediate migration to InteractionManager. And that is also causing a memory leak.
   */
  interactionHttp() { }

  interactionType(type) {
    this.interactionType = type
    return this
  }

  setUser(user) {
    this.user = user
    return this
  }

  async sendAck(typeAck, data) {
    let type = 4
    switch (typeAck) {
      case 'update':
        type = 7
        break
      case 'respond':
        type = 4
        break
      case 'later':
        type = 5
        break
      case 'ack':
        type = 6
        break
      default:
        type = 4
    }

    if (this.timeout === true) {
      data = {
        content: 'The time for this interaction has ended. Run the command again to resume action again.',
        flags: 1 << 6
      }
    }
    if (this.isHttp) {
      this.interactionPost.send({
        type: 10002,
        id: this.id,
        data: {
          type: type,
          data: data,
        }
      })
    } else {
      this.client.requestHandler.request('POST', `/interactions/${this.id}/${this.token}/callback`, true, {
        type: type,
        token: this.token,
        data: data,
      }, null)
    }
    return this
  }
}
