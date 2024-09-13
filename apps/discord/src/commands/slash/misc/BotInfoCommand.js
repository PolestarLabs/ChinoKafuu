import { CommandBase } from 'eris'
import os from 'os'
import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext, version } from '../../../structures/util'

export default class BotInfoCommand extends Command {
  constructor() {
    super({
      name: 'botinfo',
      aliases: ['infobot'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('botinfo')
        .setDescription('Shows more information about me.')
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    const getCommit = ctx.client.pluginManager.pluginStore.get('buildStore').classState
    const description = [
      `**${ctx._locale('commands:botinfo.guildsAmount')}:** ${Number(ctx.client.guilds.size).toLocaleString()}`,
      `**${ctx._locale('commands:botinfo.usersAmount')}:** ${Number(ctx.client.guilds.reduce((a, b) => a + b.memberCount, 0)).toLocaleString()}`,
      `**${ctx._locale('commands:botinfo.shardLatency')}:** ${ctx.message.guild.shard.latency}ms (Shard: ${ctx.message.guild.shard.id})`,
      `**${ctx._locale('commands:botinfo.memoryUsage')}:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB (${(process.resourceUsage().maxRSS / 1024 / 1024).toFixed(2)}MB)`,
      `**${ctx._locale('commands:botinfo.clientVersion')}:** ${version} ${getCommit.commit === null ? '' : `[(${getCommit.commit.substring(0, 7)})](https://github.com/RabbitHouseCorp/ChinoKafuu/commit/${getCommit.commit})`}`,
      `**${ctx._locale('commands:botinfo.shardUptime')}:** <t:${parseInt(ctx.client.shardUptime.get(ctx.message.guild.shard.id).uptime / 1000).toFixed(0)}:R>`
    ]
    const social_media = [
      `[${Emoji.getEmoji('discord_logo').mention} | ${ctx._locale('commands:botinfo.supportServer')}](https://discord.gg/Jr57UrsXeC)`,
      `[${Emoji.getEmoji('wumpus_heart').mention} | ${ctx._locale('commands:botinfo.voteOnMe')}](https://top.gg/bot/481282441294905344/vote)`,
      `[${Emoji.getEmoji('x').mention} | X](https://x.com/@ChinoKafuuBot)`,
      `[${Emoji.getEmoji('github').mention} | GitHub](https://github.com/RabbitHouseCorp/ChinoKafuu)`,
      `[${Emoji.getEmoji('crowdin').mention} | Crowdin](https://crowdin.com/project/chinokafuu)`,
    ]
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:botinfo.title'))
    embed.setDescription(`${ctx._locale('commands:botinfo.extraDescription', { 0: ctx.message.author.mention, 1: Emoji.getEmoji('nodejs').mention, 2: Emoji.getEmoji('eris').mention, })}\n\u200B`)
    embed.setFooter(`${ctx._locale('commands:botinfo.cpuModel')}: ${os.cpus().map(i => i.model)[0]}`)
    embed.setThumbnail(ctx.client.user.avatarURL)
    embed.addField(ctx._locale('commands:botinfo.specs'), description.join('\n'))
    embed.addField(ctx._locale('commands:botinfo.social_media'), social_media.join('\n'))
    const full_permission = new Button()
      .setLabel(ctx._locale('commands:botinfo.recommendedPermission'))
      .setURL(`https://discord.com/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=1378654604670&scope=bot%20applications.commands`)
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('discord_verified_app').name, id: Emoji.getEmoji('discord_verified_app').id })
    const minimal_permission = new Button()
      .setLabel(ctx._locale('commands:botinfo.minimalPermission'))
      .setURL(`https://discord.com/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=641068480&scope=bot%20applications.commands`)
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('discord_app').name, id: Emoji.getEmoji('discord_app').id })

    ctx.send({
      embeds: [embed],
      components:
        [
          {
            type: 1,
            components: [full_permission, minimal_permission]
          }
        ]
    })
  }
}
