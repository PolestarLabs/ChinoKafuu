import { CommandBase, CommandOptions } from 'eris'
import { Button, Command, EmbedBuilder, Emoji, NightlyInteraction, SlashCommandContext } from '../../../structures/util'

export default class BanInfoCommand extends Command {
  constructor() {
    super({
      name: 'baninfo',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['banMembers', 'embedLinks']
      },
      {
        entity: 'user',
        permissions: ['banMembers']
      }],
      slash: new CommandBase()
        .setName('baninfo')
        .setDescription('Check the ban information about a user')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
            .isRequired()
        )
    })
  }

  /**
     * @method run
     * @param {SlashCommandContext} ctx
     * @returns {void}
     */
  async run(ctx) {
    const guild = ctx.message.guild
    const bans = await guild.getBans()
    const user = ctx.args.get('user').value?.id ?? ctx.args.get('user').value
    const member = bans.find(ban => ban.user.id === user)
    if (!member) return ctx.replyT('error', 'commands:unban.notBanned')
    const embed = new EmbedBuilder()
    embed.setColor('MODERATION')
    embed.setThumbnail(member.user.avatarURL)
    embed.setTitle(ctx._locale('commands:baninfo.title'))
    embed.addField(ctx._locale('commands:baninfo.memberName'), `@${member.user.username} (\`${member.user.id}\`)`)
    embed.addField(ctx._locale('commands:baninfo.reason'), member.reason ? member.reason : ctx._locale('basic:noReason'))
    const unban = new Button()
      .setStyle(4)
      .setLabel(ctx._locale('commands:baninfo.unban'))
      .setEmoji({ name: Emoji.getEmoji('tools').name })
      .customID('unban')
    ctx.send({ embeds: [embed], components: [{ type: 1, components: [unban.build()] }] }).then(async (msg) => {
      const ack = new NightlyInteraction(msg)
      ack.on('collect', ({ packet }) => {
        if ((ctx.message.author.id !== packet.d.member.user.id && packet.d.application_id === ctx.client.user.id)) {
          ack.sendAck('respond', {
            content: `${Emoji.getEmoji('error').mention} **|** <@${packet.d.member.id}> ${ctx._locale('commands:baninfo.onlyWhoExecuted')}`,
            flags: 1 << 6
          })
          return
        }
        switch (packet.d.data.custom_id) {
          case 'unban': {
            if (!member) return
            this.unban(guild, member, ctx, ack)
          }
        }
      })
    })
  }

  unban(guild, member, ctx, ack) {
    guild.unbanMember(member.user.id, ctx._locale('basic:punishment.reason', { 0: `@${ctx.message.member.user.username}`, 1: ctx._locale('basic:noReason') })).then(() => {
      const unbanEmbed = new EmbedBuilder()
      unbanEmbed.setColor('MODERATION')
      unbanEmbed.setThumbnail(member.user.avatarURL)
      unbanEmbed.setTitle(ctx._locale('basic:punishment.unbanned', { 0: `@${member.user.username}` }))
      unbanEmbed.addField(ctx._locale('basic:punishment.embed.memberName'), `@${member.user.username} (\`${member.user.id}\`)`)
      unbanEmbed.addField(ctx._locale('basic:punishment.embed.staffName'), `@${ctx.message.member.user.username} (\`${ctx.message.member.user.id}\`)`)
      unbanEmbed.addField(ctx._locale('basic:punishment.embed.reason'), ctx._locale('basic:noReason'))

      ack.sendAck('update', {
        embeds: [unbanEmbed],
        components: []
      })
      const server = ctx.db.guild
      if (server.punishModule) {
        const channel = ctx.message.guild.channels.get(server.punishChannel)
        if (!channel) {
          server.punishModule = false
          server.punishChannel = ''
          server.save()
          return ctx.replyT('error', 'events:channel-not-found')
        }

        channel.createMessage(unbanEmbed.build())
      }
    })
  }
}
