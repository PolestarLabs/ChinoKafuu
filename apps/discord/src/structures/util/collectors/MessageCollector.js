import { Collector } from './Collector'

export class MessageCollector extends Collector {
  constructor(channel, filter, options = {}) {
    super(filter, options)

    this.channel = channel
    this.client = channel.client

    this.client.on('messageCreate', this.handleCollect.bind(this))

    this.once('end', () => {
      this.client.removeListener('messageCreate', this.handleCollect.bind(this))
    })
  }

  collect(message) {
    if (this.ended === true) {
      /**
             * Someone forgot to implement this. To hold the event
             */
      return
    }
    if (message.author.bot) {
      return null
    }

    if (message.channel.id === this.channel.id) {
      return message
    }

    return null
  }
}

