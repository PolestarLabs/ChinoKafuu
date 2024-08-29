export class BlacklistUtils {
  constructor(client) {
    this.client = client
  }

  async verifyGuild(guild) {
    try {
      const guildData = await this.client.database.guilds.getOrCreate(guild.id)
      const guildOwner = await this.client.database.users.getOrCreate(guild.ownerID)
      if (guildData.blacklist) return true
      if (guildOwner.blacklist) return true
      return false
    } catch {
      return false
    }
  }
}