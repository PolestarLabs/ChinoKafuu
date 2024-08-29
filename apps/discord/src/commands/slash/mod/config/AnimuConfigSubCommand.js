import { Command, SlashCommandContext } from '../../../../structures/util'
const Status = {
  typeOne: 'enable',
  typeTwo: 'disable'
}

export default class AnimuConfigSubCommand extends Command {
  constructor() {
    super({
      name: 'config animu',
      aliases: ['module', 'configurações', 'configurar'],
      permissions: [{
        entity: 'user',
        permissions: ['manageGuild']
      },
      {
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
  run(ctx) {
    if (ctx.args.get('status') === undefined) return ctx.replyT('error', 'commands:config.channel.needStatus')
    switch (ctx.args.get('status').value) {
      case Status.typeOne: {
        // Tag: NEED_CHANNEL
        // Message: You need to search the channel in the command to select it and set the correct channel.
        if (ctx.args.get('channel')?.value === undefined) return ctx.replyT('error', 'commands:config.channel.needChannel')
        // Tag: CHANNEL_NOT_WAS_FOUND
        // Message: Woah! Channel not found check permissions from Chino Kafuu most likely she is without permission, if not permission then channel has been deleted.
        if (ctx.message.guild.channels.get(ctx.args.get('channel')?.value) === undefined) return ctx.replyT('error', 'commands:config.channel.channelWasNotFound')
        // Tag:  SAME_CHANNEL
        // Message: It looks like it's the same channel you selected. (<#{channel-id}> - {channel-id})
        if (ctx.args.get('channel').value === ctx.db.guild.animuChannel) return ctx.replyT('error', 'commands:config.channel.sameChannel')
        ctx.db.guild.animu = true
        ctx.db.guild.animuChannel = ctx.args.get('channel').value
        ctx.db.guild.save()

        // Tag:  CHANNEL_SELECTED_WITH_SUCCESS
        // Message: {module-name} is set to connect to the voice channel automatically on {channel-id}
        ctx.replyT('success', 'commands:config.modules.animu.enable')
        return
      }
      case Status.typeTwo: {
        // Tag:  CHANNEL_SELECTED_WITH_SUCCESS
        // Message: The module is already disabled!
        if (ctx.db.guild.animu === false) return ctx.replyT('error', 'commands:config.channel.moduleHasDisabled')

        ctx.db.guild.animu = false
        ctx.db.guild.animuChannel = ''
        ctx.db.guild.save()
        // Tag:  CHANNEL_SELECTED_WITH_SUCCESS
        // Message: The module has been successfully disabled!
        ctx.replyT('success', 'commands:config.modules.animu.disable')
        return
      }

    }
    // Tag: CONFIG_BUG_DETECTED
    // Message: That's weird! Apparently some bug occurred... What happened?!?
    ctx.replyT('error', 'commands:config.channel.moduleIfFoundBug', { 0: this.name })
    new Error({})
  }
}
