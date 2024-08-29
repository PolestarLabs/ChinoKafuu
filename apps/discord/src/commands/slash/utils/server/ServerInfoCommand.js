import { Button, Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../../structures/util'

export default class ServerInfoCommand extends Command {
  constructor() {
    super({
      name: 'server info',
      aliases: ['guildinfo'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const guild = ctx.message.guild
    const owner = await ctx.getUser(guild.ownerID)
    const _locale = ctx._locale
    const voiceChannel = guild.channels.filter(channel => channel.type === 2)
    let membersInCall = 0
    if (voiceChannel.length > 0) {
      for (const voice of voiceChannel) {
        membersInCall += voice.voiceMembers.size
      }
    }
    const channelType = {
      text: guild.channels.filter(channel => channel.type === 0).length,
      voice: guild.channels.filter(channel => channel.type === 2).length
    }
    const guildFeatures = []
    if (guild.features.length > 0) {
      guild.features.forEach((features) => {
        guildFeatures.push(`${_locale(`commands:serverinfo.features.${features}`)}`)
      })
    }
    const description = [
      `**${_locale('commands:serverinfo.guildName')}:** ${guild.name} (\`${guild.id}\`)`,
      `**${_locale('commands:serverinfo.guildOwner')}:** @${owner.username} (\`${owner.id}\`)`,
      `**${_locale('commands:serverinfo.guildAFKChannel.title')}:** ${guild.channels.get(guild.afkChannelID) ? `${guild.channels.get(guild.afkChannelID).name} (\`${guild.channels.get(guild.afkChannelID).id}\`)` : _locale('commands:serverinfo.guildAFKChannel.noAfkChannel')}`,
      `**${_locale('commands:serverinfo.booster.levelCount')}:** ${guild.premiumTier} (${_locale('commands:serverinfo.booster.boosterCount')}: ${guild.premiumSubscriptionCount})`,
      `**${_locale('commands:serverinfo.guildMember')}:** ${guild.memberCount}`,
      `**${_locale('commands:serverinfo.guildCreateAt')}:** <t:${parseInt(guild.createdAt / 1000).toFixed(0)}:F> (<t:${parseInt(guild.createdAt / 1000).toFixed(0)}:R>)`
    ]
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setAuthor(guild.name, guild.icon ? guild.iconURL : 'https://cdn.discordapp.com/attachments/468878707449397258/785277583411118080/PicsArt_12-06-07.52.13.jpg')
    embed.setFooter(`Shard ID: ${guild.shard.id}/${ctx.client.shards.size} • ${_locale('commands:serverinfo.joinedAt')} ${new Date(ctx.message.guild.members.get(ctx.client.user.id).joinedAt).toDateString()}`)
    embed.addField(_locale('commands:serverinfo.general'), description.join('\n'))
    embed.addField(_locale('commands:serverinfo.guildChannel.title', { 0: guild.channels.size }), [
      `**${_locale('commands:serverinfo.guildChannel.text')}:** ${channelType.text}`,
      `**${_locale('commands:serverinfo.guildChannel.voice')}:** ${channelType.voice}`,
      `**${_locale('commands:serverinfo.guildChannel.voiceMembers')}:** ${membersInCall}`
    ].join('\n'))
    embed.addField(_locale('commands:serverinfo.features.title'), (guildFeatures.length > 0) ? guildFeatures.join(', ') : _locale('commands:serverinfo.features.dontHave'))
    const banner = new Button()
      .setEmoji({ name: Emoji.getEmoji('photo_frame').name })
      .setLabel(_locale('commands:serverinfo.banner'))
      .setStyle(5)
      .setURL(guild.bannerURL)
    const splash = new Button()
      .setEmoji({ name: Emoji.getEmoji('photo_frame').name })
      .setLabel(_locale('commands:serverinfo.splash'))
      .setStyle(5)
      .setURL(guild.splashURL)
    if (guild.banner && guild.splash) {
      ctx.send({ embeds: [embed], components: [{ type: 1, components: [banner, splash] }] })
    } else {
      if (guild.banner) {
        ctx.send({ embeds: [embed], components: [{ type: 1, components: [banner] }] })
      } else if (guild.splash) {
        ctx.send({ embeds: [embed], components: [{ type: 1, components: [splash] }] })
      } else {
        ctx.send(embed.build())
      }
    }
  }
}
