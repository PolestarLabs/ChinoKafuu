import axios from 'axios'
import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'

export default class ChannelInfoCommand extends Command {
  constructor() {
    super({
      name: 'channelinfo',
      aliases: ['chatinfo'],
      permissions: [{
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('channelinfo')
        .setDescription('Hows some informations about a channel.')
        .addOptions(
          new CommandOptions()
            .setType(7)
            .setName('channel')
            .setDescription('Mention a text channel.')
            .isRequired(),
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const args = ctx.args.get('channel').value
    let channel = ctx.client.getChannel(args)
    if (!channel) {
      channel = ctx.message.channel
    }
    const _locale = ctx._locale
    const request = await axios.get(`https://discord.com/api/v8/channels/${channel.id}`, {
      headers: {
        Authorization: process.env.DISCORD_TOKEN
      }
    })

    const data = request.data

    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(_locale('commands:channelinfo.title', { 0: data.name }))
    embed.setDescription((data.topic && channel.type !== 1) ? `\`\`\`${data.topic}\`\`\`` : `\`${_locale('commands:channelinfo.noTopic')}\``)
    embed.addField(_locale('commands:channelinfo.mention'), `\`${channel?.mention}\`` ?? channel.name, true)
    embed.addField(_locale('commands:channelinfo.channelID'), `\`${channel.id}\``, true)
    embed.addField('NSFW', `\`${_locale(`basic:boolean.${data.nsfw}`)}\``, true)
    embed.addField(_locale('commands:channelinfo.guild'), `\`${channel.guild.name}\``, true)
    embed.addField(_locale('commands:channelinfo.category'), `\`${channel.guild.channels.get(channel.parentID)?.name}\``, true)
    embed.addField(_locale('commands:channelinfo.createdAt'), `<t:${parseInt(channel.createdAt / 1000).toFixed(0)}:F>`, true)

    ctx.send(embed.build())
  }
}
