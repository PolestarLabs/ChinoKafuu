import { Bot } from '../../structures/Bot'
import { Logger } from '../../structures/util/Logger'

export class Cluster {
  constructor() {
    Logger.info('Online. Spawning shards...')
    if (process.env.PRODUCTION === 'true' && !process.env.DISCORD_MONGO_URI) {
      Logger.error('Production mode enabled without a database URI! Make sure DISCORD_MONGO_URI is in your .env file.')
    }
    if (process.env.PRODUCTION === 'false' && !process.env.DISCORD_MONGO_URI) {
      Logger.warning('Starting application without DISCORD_MONGO_URI in .env.')
    }
    this.spawnShards()
  }

  async spawnShards() {
    this.shardManager = new Bot(process.env.DISCORD_TOKEN, {
      firstShardID: this.firstClusterShardID,
      lastShardID: this.firstClusterShardID + (parseInt(process.env.SHARDS_PER_CLUSTER) - 1),
      maxShards: parseInt(process.env.SHARD_AMOUNT),
      defaultImageFormat: 'png',
      defaultImageSize: 2048,
      restMode: true,
      allowedMentions: {
        everyone: false,
        roles: false,
        users: true,
        repliedUser: true
      },
      intents: 14079,
      rest: {
        baseURL: '/api/v9'
      }
    })

    try {
      await this.shardManager.connect().then(() => {
        Logger.debug('Successfully connected to Discord\'s gateway.')
      })
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  get firstClusterShardID() {
    if (process.env.CLUSTER_ID === '0') return 0
    return parseInt(process.env.CLUSTER_ID) * parseInt(process.env.SHARDS_PER_CLUSTER)
  }
}
