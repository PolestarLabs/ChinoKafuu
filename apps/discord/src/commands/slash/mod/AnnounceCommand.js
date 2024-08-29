import { CommandBase, CommandOptions } from 'eris'
import { Button, Command, EmbedBuilder, Emoji, NightlyInteraction, SlashCommandContext } from '../../../structures/util'

export default class AnnounceCommand extends Command {
  constructor() {
    super({
      name: 'announce',
      aliases: ['anunciar'],
      permissions: [{
        entity: 'bot',
        permissions: ['mentionEveryone', 'embedLinks', 'addReactions']
      },
      {
        entity: 'user',
        permissions: ['manageGuild', 'mentionEveryone']
      }],
      slash: new CommandBase()
        .setName('announce')
        .setDescription('Send a announce to current server for all members (or not).')
        .addOptions(
          new CommandOptions()
            .setType(7)
            .setName('channel')
            .setDescription('Send a announce to channel.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Send a announce to current server for all members (or not).')
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
    const channel = guild.channels.get(ctx.args.get('channel').value)
    if (!channel) return ctx.replyT('error', 'commands:announce.channelNotFound')
    const announce = ctx.args.get('text').value
    if (!announce) return ctx.replyT('error', 'commands:announce.argsNotFound')
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setAuthor(guild.name, guild.iconURL)
    embed.setDescription(announce)
    embed.setFooter(ctx._locale('commands:announce.embedSendBy', { 0: `@${ctx.message.member.username}` }), ctx.message.member.avatarURL)
    const everyone = new Button()
    everyone.setStyle(1)
    everyone.setLabel(ctx._locale('commands:announce.mentionEveryone'))
    everyone.customID('everyone')
    everyone.setEmoji({ name: Emoji.getEmoji('success').name, id: Emoji.getEmoji('success').id })
    const here = new Button()
    here.setStyle(1)
    here.setLabel(ctx._locale('commands:announce.mentionHere'))
    here.customID('here')
    here.setEmoji({ name: Emoji.getEmoji('warn').name, id: Emoji.getEmoji('warn').id })
    const nobody = new Button()
    nobody.setStyle(1)
    nobody.setLabel(ctx._locale('commands:announce.mentionAnyone'))
    nobody.customID('nobody')
    nobody.setEmoji({ name: Emoji.getEmoji('error').name, id: Emoji.getEmoji('error').id })
    const cancel = new Button()
    cancel.setStyle(4)
    cancel.setLabel('Cancel the announcement.')
    cancel.customID('cancel')
    cancel.setEmoji({ name: Emoji.getEmoji('chino_shock').name, id: Emoji.getEmoji('chino_shock').id })
    ctx.replyT('warn', 'commands:announce.requestConfirm', { 0: channel.mention }, {
      components: [{ type: 1, components: [everyone.build(), here.build(), nobody.build(), cancel.build()] }]
    }).then(async msg => {
      const collector = new NightlyInteraction(msg)
      collector.on('collect', async ({ packet }) => {
        if ((packet.d.member.user.id !== ctx.message.author.id) && (packet.d.application_id === ctx.client.user.id)) {
          collector.sendAck('respond', {
            content: `${Emoji.getEmoji('error').mention} **|** <@${packet.d.member.id}> ${ctx._locale('commands:announce.notAllowed')}`,
            flags: 1 << 6
          })
          return
        }
        switch (packet.d.data.custom_id) {
          case 'everyone': {
            collector.sendAck('update', { content: `${Emoji.getEmoji('success').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:announce.announceSent')}`, components: [] })
            channel.createMessage(embed.build('@everyone'))
          }
            break
          case 'here': {
            collector.sendAck('update', { content: `${Emoji.getEmoji('success').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:announce.announceSent')}`, components: [] })
            channel.createMessage(embed.build('@here'))
          }
            break
          case 'nobody': {
            collector.sendAck('update', { content: `${Emoji.getEmoji('success').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:announce.announceSent')}`, components: [] })
            channel.createMessage(embed.build())
          }
            break
          case 'cancel': {
            collector.sendAck('update', { content: `${Emoji.getEmoji('cocoa_what').mention} **|** ${ctx.message.author.mention}, ${ctx._locale('commands:announce.cancelled')}`, components: [] })
          }
            break
        }
      })
    })
  }
}
