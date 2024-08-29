import { Choice, CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class ChatCommand extends Command {
  constructor() {
    super({
      name: 'chat',
      permissions: [{
        entity: 'both',
        permissions: ['manageChannels']
      }],
      slash: new CommandBase()
        .setName('chat')
        .setDescription('Locks the chat, updating the `Send Messages` permissions for the `@everyone` role')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('mode')
            .setDescription('Locks the chat, updating the `Send Messages` permissions for the `@everyone` role')
            .addChoices(
              new Choice()
                .setName('off')
                .setValue('off'),
              new Choice()
                .setName('on')
                .setValue('on'),
            )
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
    const role = ctx.message.guild.id
    switch (ctx.args.get('mode').value) {
      case 'on': {
        ctx.message.channel.editPermission(role, 2048, 0, 'role').then(ctx.replyT('success', 'commands:chat.unlocked'))
      }
        break
      case 'off': {
        ctx.message.channel.editPermission(role, 0, 2048, 'role').then(ctx.replyT('success', 'commands:chat.locked'))
      }
        break
    }
  }
}
