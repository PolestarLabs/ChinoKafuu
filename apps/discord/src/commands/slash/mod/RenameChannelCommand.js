import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class RenameChannelCommand extends Command {
  constructor() {
    super({
      name: 'renamechannel',
      aliases: ['renomearcanal'],
      permissions: [{
        entity: 'both',
        permissions: ['manageChannels']
      }],
      slash: new CommandBase()
        .setName('renamechannel')
        .setDescription('Renames a channel in the current guild.')
        .addOptions(
          new CommandOptions()
            .setName('channel')
            .setDescription('Mention of the channel who you want rename.')
            .setType(7)
            .isRequired(),
          new CommandOptions()
            .setName('name')
            .setDescription('The new name of the channel.')
            .setType(3)
            .isRequired()
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  run(ctx) {
    const guild = ctx.message.guild
    const channel = guild.channels.get(ctx.args.get('channel').value)
    const name = ctx.args.get('name').value.replace('&', '＆').replace('|', '│')
    if (!channel) return ctx.replyT('error', 'commands:renamechannel.channelNotFound')
    if (!name) return ctx.replyT('error', 'commands:renamechannel.invalidName')
    channel.edit({
      name
    }).then((channel) => {
      ctx.replyT('success', 'commands:renamechannel.successfullyRenamed', { 0: channel.name })
    })
  }
}
