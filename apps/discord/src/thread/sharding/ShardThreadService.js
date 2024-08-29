import { ExtendedUser, Shard } from 'eris'
import { isMainThread, parentPort, workerData } from 'worker_threads'

export class ShardThread extends Shard {
  constructor(...args) {
    super(...args)
    this.shardID = args[0]
  }

  /**
   * This class extension was created to send data between threads and will also serve to control events that the bot will not use.
   */
  wsEvent(packet) {
    switch (packet.t) {
      case 'PRESENCE_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'VOICE_STATE_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'TYPING_START': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_DELETE_BULK': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_REACTION_ADD': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_REACTION_REMOVE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_REACTION_REMOVE_ALL': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'MESSAGE_REACTION_REMOVE_EMOJI': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_MEMBER_ADD': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_MEMBER_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_MEMBER_REMOVE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_BAN_ADD': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_BAN_REMOVE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_ROLE_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_ROLE_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_ROLE_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'INVITE_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'INVITE_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'THREAD_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'THREAD_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'THREAD_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'THREAD_MEMBERS_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_RECIPIENT_ADD': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_RECIPIENT_REMOVE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_MEMBERS_CHUNK': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_SYNC': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'RESUMED':
      case 'READY': {
        if (!isMainThread) {
          parentPort.postMessage({ type: 'shardSpawn', id: this.id, data: { id: this.id } })
          parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { id: this.id, packet } })
          if (this.id >= workerData.shardLimit - 1) {
            this.emit('ready')
          }
        }
        if (packet.d.resume_gateway_url !== undefined) {
          this.resumeGatewayURL = packet.d.resume_gateway_url
        }

        if (packet.d.session_type !== undefined) {
          this.sessionType = packet.d.sessionType
        }

        this.connectAttempts = 0
        this.reconnectInterval = 1000

        this.connecting = false
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout)
        }
        this.connectTimeout = null
        this.status = 'ready'
        this.presence.status = 'online'
        this.client.shards._readyPacketCB()
        if (packet.t === 'RESUMED') {
          this.heartbeat()
          this.preReady = true
          this.ready = true
          this.emit('resume')
          return
        }

        this.client.user = this.client.users.update(new ExtendedUser(packet.d.user, this.client), this.client)
        if (this.client.user.bot) {
          this.client.bot = true
          if (!this.client._token.startsWith('Bot ')) {
            this.client._token = 'Bot ' + this.client._token
          }
        } else {
          this.client.bot = false
        }

        if (packet.d._trace) {
          this.discordServerTrace = packet.d._trace
        }

        this.sessionID = packet.d.session_id

        this.client.application = packet.d.application
        this.preReady = true
        this.emit('shardPreReady', this.id)
        if (this.client.unavailableGuilds.size > 0 && packet.d.guilds.length > 0) {
          this.restartGuildCreateTimeout()
        } else {
          this.checkReady()
        }
        break
      }
      case 'VOICE_SERVER_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'RELATIONSHIP_ADD': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'RELATIONSHIP_REMOVE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'GUILD_EMOJIS_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'CHANNEL_PINS_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'WEBHOOKS_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'PRESENCES_REPLACE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'INTERACTION_UPDATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'INTERACTION_DELETE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      case 'INTERACTION_CREATE': {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        break
      }
      default: {
        if (!isMainThread) parentPort.postMessage({ type: 'websocketMessage', id: this.id, data: { packet } })
        this.emit('unknown', packet, this.id)
        break
      }
    }
    packet = null
  }
}