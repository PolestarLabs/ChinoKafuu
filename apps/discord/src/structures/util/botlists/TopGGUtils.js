import { Api } from '@top-gg/sdk'

export class TopGGUtils extends Api {
  constructor() {
    super(process.env.TOPGG_TOKEN)
    this.token = process.env.TOPGG_TOKEN ? process.env.TOPGG_TOKEN : null
  }

  async getVote(id) {
    if (!id || !this.token) return true
    return await this.hasVoted(id)
  }

  async post(client) {
    if (!this.token) return
    await this.postStats({
      serverCount: client.guilds.size,
      shardCount: client.shards.size
    })
  }
}