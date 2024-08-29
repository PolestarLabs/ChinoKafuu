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
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:botinfo.title'))
    embed.setDescription(`${ctx._locale('commands:botinfo.extraDescription', { 0: ctx.message.author.mention, 1: Emoji.getEmoji('nodejs').mention, 2: Emoji.getEmoji('eris').mention, })}\n\u200B`)
    embed.setFooter(`${ctx._locale('commands:botinfo.cpuModel')}: ${os.cpus().map(i => i.model)[0]}`)
    embed.setThumbnail(ctx.client.user.avatarURL)
    embed.addField(ctx._locale('commands:botinfo.specs'), description.join('\n'))
    const support_server = new Button()
      .setLabel(ctx._locale('commands:botinfo.supportServer'))
      .setURL('https://discord.gg/Jr57UrsXeC')
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('discord_logo').name, id: Emoji.getEmoji('discord_logo').id })
    const full_permission = new Button()
      .setLabel(ctx._locale('commands:botinfo.recommendedPermission'))
      .setURL(`https://discord.com/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=1378654604670&scope=bot%20applications.commands`)
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('discord_verified_bot').name, id: Emoji.getEmoji('discord_verified_bot').id })
    const minimal_permission = new Button()
      .setLabel(ctx._locale('commands:botinfo.minimalPermission'))
      .setURL(`https://discord.com/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=641068480&scope=bot%20applications.commands`)
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('botTag').name, id: Emoji.getEmoji('botTag').id })
    const twitter_button = new Button()
      .setLabel('Twitter')
      .setURL('https://twitter.com/ChinoKafuuBot')
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('twitter').name, id: Emoji.getEmoji('twitter').id })
    const github_button = new Button()
      .setLabel('GitHub')
      .setURL('https://github.com/RabbitHouseCorp/ChinoKafuu')
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('github').name, id: Emoji.getEmoji('github').id })
    const vote_button = new Button()
      .setLabel(ctx._locale('commands:botinfo.voteOnMe'))
      .setURL('https://top.gg/bot/481282441294905344/vote')
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('wumpus').name, id: Emoji.getEmoji('wumpus').id })
    const crowdin_button = new Button()
      .setLabel('Crowdin')
      .setURL('https://crowdin.com/project/chinokafuu')
      .setStyle(5)
      .setEmoji({ name: Emoji.getEmoji('crowdin').name, id: Emoji.getEmoji('crowdin').id })

    ctx.send({
      embeds: [embed],
      components:
        [
          {
            type: 1,
            components: [support_server, full_permission, minimal_permission, twitter_button, github_button]
          },
          {
            type: 1,
            components: [vote_button, crowdin_button]
          }
        ]
    })
  }
}
