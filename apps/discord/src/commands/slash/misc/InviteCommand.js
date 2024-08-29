import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
import { CommandBase } from 'eris'

export default class InviteCommand extends Command {
  constructor() {
    super({
      name: 'invite',
      aliases: ['convite', 'convidar'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('invite')
        .setDescription('Shows how you can add me in your server.')
    })
  }

  /**
  * @method run
  * @param {SlashCommandContext} ctx
  * @returns {void}
  */
  async run(ctx) {
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setTitle(ctx._locale('commands:invite.addMeInYourGuild'))
    embed.setDescription(ctx._locale('commands:invite.canAddMe', { 0: ctx.client.user.id }))
    embed.setImage('https://cdn.discordapp.com/attachments/481807707066859530/784903189136801852/c3377764d7d7cdcdcb98c466ce341c61.png')
    embed.setFooter(`©️ ${ctx.client.user.username}`)
    embed.setTimestamp()

    ctx.send(embed.build())
  }
}
