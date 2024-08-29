import { Choice, CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../structures/util'

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('ping')
        .setDescription('View the latency of Discord.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('options')
            .setDescription('Choose one of these options to view.')
            .addChoices(
              new Choice()
                .setName('shards')
                .setValue('shards'),
              new Choice()
                .setName('threads')
                .setValue('threads'),
              new Choice()
                .setName('clusters')
                .setValue('clusters')
            )
        )
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    switch (ctx.args.get('options')?.value) {
      case 'shards': {
        const embed = new EmbedBuilder()
        embed.setFooter(ctx._locale('commands:ping.totalShard', { totalShard: ctx.client.shards.size }))
        embed.setColor('DEFAULT')
        embed.setFooter(`©️ ${ctx.client.user.username}`)
        embed.setTimestamp()

        ctx.client.shards.forEach(shard => {
          const shardStatus = shard.status === 'ready' ? ['CONNECTED', '<:online:518876154720026633>']
            : shard.status === 'disconnected' ? ['OFFLINE', '<:offline:518876154782941187>']
              : shard.status === 'connecting' ? ['CONNECTING', '<:dnd:518876154933936146>']
                : ['HANDSHAKING', '<:idle:518876154912833549>']
          embed.addField(`Shard ${shard.id} ${shardStatus[1]}`, `${shard.latency !== Infinity ? `Ping: ${shard.latency}ms` : ''}\nStatus: ${shardStatus[0]}\nUptime: <t:${parseInt(ctx.client.shardUptime.get(ctx.message.guild.shard.id).uptime / 1000).toFixed(0)}:R>`, true)
        })

        ctx.send(embed.build())
        break
      }

      case 'clusters': {
        if (ctx.client.clusters) {
          const clusters = await ctx.client.clusters.getAveragePing()

          const embed = new EmbedBuilder()
          embed.setFooter(ctx._locale('commands:ping.totalClusters', { totalClusters: clusters.length }))
          embed.setColor('DEFAULT')
          embed.setFooter(`©️ ${ctx.client.user.username}`)
          embed.setTimestamp()
          clusters.forEach(cluster => {
            const emoji = cluster.status === 'operational' ? '<:online:518876154720026633>'
              : cluster.status === 'clusterdown' ? '<:offline:518876154782941187>'
                : cluster.status === 'unoperational' ? '<:dnd:518876154933936146>'
                  : '<:idle:518876154912833549>'
            embed.addField(`Cluster ${cluster.id} ${emoji}`, `*${ctx._locale('commands:ping.' + cluster.status)} (${ctx._locale('commands:ping.percentOn', { perc: cluster.percentOn.toFixed(1) })})*\n${ctx._locale('commands:ping.avgPing', { avg: cluster.avgPing.toFixed(1) })}`, true)
          })
          ctx.send(embed.build())
        } else {
          const embed = new EmbedBuilder()
          embed.setColor('#ffdb57')
          embed.setDescription('Cluster system is disabled.')
          ctx.send(embed.build())
        }
        break
      }
      case 'threads': {
        if (process.env?.THREAD !== 'true')
          return ctx.send(
            new EmbedBuilder()
              .setColor('#ffdb57')
              .setDescription('Thread system is disabled.')
              .build()
          )

        const bar = '**==============================**'
        ctx.send({
          content: `**Resource Enabled**: \`${ctx.client.getResourceThread.join(', ').toTitle()}\`\nRunning ${ctx.client.getShardsByThreads().length} active threads and utilizing **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB** of RAM, more details below`,
          embeds: ctx.client.getShardsByThreads().map((thread, index) => {
            let threadID = null
            const fields = thread.shards.map((shard) => {
              if (ctx.message.guild.shard.id === shard.id) {
                threadID = thread.threadActive.threadId
              }
              const shardStatus = shard.status === 'ready' ? ['CONNECTED', '<:online:518876154720026633>']
                : shard.status === 'disconnected' ? ['OFFLINE', '<:offline:518876154782941187>']
                  : shard.status === 'connecting' ? ['CONNECTING', '<:dnd:518876154933936146>']
                    : ['HANDSHAKING', '<:idle:518876154912833549>']
              const uptime = ctx.client.shardUptime.get(shard.id) ? `**Uptime**: <t:${parseInt((ctx.client.shardUptime.get(shard.id).uptime) / 1000).toFixed(0)}:R>` : ''
              return {
                name: `${ctx.message.guild.shard.id === shard.id ? '***** ' : ''}Shard ${shard.id} ${shardStatus[1]}`,
                value: `${shard.latency !== Infinity ? `**Ping**: ${shard.latency}ms` : ''}\n**Status**: ${shardStatus[0]}\n${uptime}`,
                inline: true
              }
            })
            return {
              title: `${threadID === thread.threadActive.threadId ? '***** ' : ''}Thread(${ctx.client.getNameOfThread(null, index) ?? 'None'}) - ${index}`,
              color: 0x7DAFFF,
              description: `- **Shards**: ${thread.shards.length}\n- **${ctx._locale('commands:botinfo.memoryUsage')}:** ${(thread.threadActive.stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB\n- **${ctx._locale('commands:botinfo.memoryTotal')}:** ${(thread.threadActive.stats.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB\n${bar}`,
              fields
            }
          })
        })
        break
      }
      default: {
        ctx.send(Emoji.getEmoji('ping_pong').mention).then(msg => {
          const embed = new EmbedBuilder()
          embed.setColor('DEFAULT')
          embed.addField('Response Latency', `${Date.now() - msg.timestamp}ms`)
          embed.addField('API Latency', `${Math.round(ctx.message.guild.shard.latency)}ms`)
          embed.addField('MongoDB Latency', `**Latency** ${(ctx.statsDB.latency).toFixed(1)}ms\n**Jitter** ${ctx.statsDB.jitter.toFixed(2).toLocaleString()}ms`)
          embed.setFooter(`Shard: ${ctx.message.guild.shard.id}/${ctx.client.shards.size} | Cluster: ${!(ctx.client.clusters === null) ? `${process.env.CLUSTER_ID}/${process.env.CLUSTER_AMOUNT}` : ctx._locale('commands:ping.clustersDisabled')}`)
          // process.usage
          msg.edit(embed.build())
        })

      }
    }
  }
}
