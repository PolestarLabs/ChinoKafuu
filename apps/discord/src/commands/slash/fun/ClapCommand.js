import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class ClapCommand extends Command {
  constructor() {
    super({
      name: 'clap',
      aliases: ['palmas'],
      permissions: [{
        entity: 'bot',
        permissions: ['useExternalEmojis']
      }],
      slash: new CommandBase()
        .setName('clap')
        .setDescription('Let\'s clap, clap, clap, clap, clap with your friends.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Let\'s clap, clap, clap, clap, clap with your friends.')
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
    const clap = ctx.args.get('text').value.split(' ').join('<a:clap:554482751542132736>')
    if (!clap) return ctx.replyT('error', 'commands:clap.noArgs')
    const option = ctx.message.member.permission.has('mentionEveryone')

    ctx.send(clap, option)
  }
}
