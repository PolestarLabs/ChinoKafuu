import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class AboutMeCommand extends Command {
  constructor() {
    super({
      name: 'aboutme',
      aliases: ['bio', 'sobremim'],
      slash: new CommandBase()
        .setName('aboutme')
        .setDescription('Change about me in profile by using /profile.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Put your new about me here.')
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
    if (ctx.args.get('text').value.length > 128) return ctx.replyT('error', 'commands:aboutme.bioLimit')
    const bio = ctx.args.get('text').value.replace(/[`]/g, '')
    ctx.db.user.aboutme = bio
    ctx.db.user.save()
    await ctx.replyT('success', 'commands:aboutme.success', { bio: bio })
  }
}
