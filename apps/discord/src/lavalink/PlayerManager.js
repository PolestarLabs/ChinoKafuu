
// This is caused by the Eris library in the devDependencies in Sirius's package.json
// This will not affect the code, as the code is downloaded from Github:
// https://github.com/RabbitHouseCorp/eris
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { Manager } from 'sirius'
import { getConfigLavalink } from '.'
import { Logger, LoggerLavalink } from '../structures/util'
import { PlayerExtend } from './PlayerExtend'

export class PlayerManager {
  constructor(client) {
    this.manager = new Manager(client, {
      nodes: [
        ...(getConfigLavalink())
      ],
      voiceManager: {
        voice: {
          audio: {
            deafen: true
          },
          autoDisconnectFromVoiceChannel: true
        }
      }
    })
    this.manager
      .on('debug', (message) => LoggerLavalink.debug(message))
      .on('trace', (message) => LoggerLavalink.debug(message))
      .on('nodeDisconnected', () => LoggerLavalink.warning('Node Disconnected'))
      .on('reconnect', () => LoggerLavalink.warning('Reconect Node...'))
      .on('reconnect', () => LoggerLavalink.warning('Node reconnecting'))
      .on('ready', () => Logger.info('All nodes are connected.'))
      .on('error', (error) => console.error(error))
    /**
     * @type { PlayerExtend[] }
     */
    this.players = new Array()
  }

  has(guildID) {
    return this.players.find((playerExtend) => playerExtend.player.getPlayerID === guildID) != undefined
  }

  movePlayer(guildID, channelID = null) {
    return this.getPlayer(guildID).connect(channelID)
  }

  reconnectVoice(guildID) {
    return this.getPlayer(guildID)?.reconnect()
  }

  connectVoice(guildID, channelID = null) {
    return this.getPlayer(guildID)?.connect(channelID)
  }

  getPlayer(guildID) {
    if (!this.manager.isAvailable) return null
    if (this.players.find((playerExtend) => playerExtend.player.getPlayerID === guildID) != undefined)
      return this.players.find((playerExtend) => playerExtend.player.getPlayerID === guildID)
    const player = new PlayerExtend(this.manager.createPlayer(guildID), () => {
      const index = this.players.findIndex((playerExtend) => playerExtend.player.getPlayerID === guildID)
      this.players.splice(index, 1)
      this.manager.removePlayer(guildID)

    })
    this.players.push(player)
    return player
  }

  connectNode() {
    return this.manager.connect()
  }

  removePlayer(guildID) {
    this.getPlayer(guildID)?.delete()
  }

  get isAvailable() {
    return this.manager.isAvailable
  }
}