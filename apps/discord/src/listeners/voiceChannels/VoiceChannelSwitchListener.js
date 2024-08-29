import { Listener } from '../../structures/events/Listener'

export default class VoiceChannelLeaveListener extends Listener {
  constructor() {
    super()
    this.event = 'voiceChannelSwitch'
  }

  async on(client, member, newChannel, oldChannel) {
    if (!client.playerManager.isAvailable) return
    const guild = member.guild
    const voiceChannel = client.guilds.get(guild.id).channels.get(newChannel.id)
    const server = await client.database.guilds.getOrCreate(guild.id)

    if (server.animu && newChannel.id === server.animuChannel) {
      const playerExtend = client.playerManager.getPlayer(guild.id)
      if (!playerExtend.player.playingTrack || playerExtend.isConnected === false) {
        client.playerManager.getPlayer(guild.id)?.preparePlayer(voiceChannel.id)
        return
      }
    }
    if (!client.playerManager.has(guild.id)) return
    const playerExtend = client.playerManager.getPlayer(guild.id)
    if (server.animu && playerExtend.player.voiceInfo?.channelID != server.animuChannel) {
      playerExtend.delete()
      return
    }
    if (playerExtend.player?.voiceInfo?.countUsersConnected <= 0)
      client.playerManager.getPlayer(guild.id)?.delete()
  }
}
