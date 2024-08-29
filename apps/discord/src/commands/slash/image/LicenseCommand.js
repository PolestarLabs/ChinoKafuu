import { CommandBase, CommandOptions } from 'eris'
import { requestTokamak } from '../../../lib'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class LicenseCommand extends Command {
  constructor() {
    super({
      name: 'license',
      aliases: ['licence', 'licenca', 'licença'],
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('license')
        .setDescription('Are you licensed? No? Then create one for yourself! Or for someone else.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server'),
          new CommandOptions()
            .setType(3)
            .setName('text')
            .setDescription('Enter random text'),
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
    const member = await ctx.getUser(ctx.args.get('user')?.value?.id ?? ctx.args.get('user')?.value, true)
    let hoist
    if (guild.members.get(member.id)) {
      const role = guild.members.get(member.id).roles
        .map((a) => ctx.message.guild.roles.get(a))
        .filter((z) => z)
        .sort((a, b) => b.position - a.position)
      hoist = role[0]

    }

    let highRole = guild.roles.get(hoist?.id)?.color.toString(16)
    if (!highRole || highRole < 0) highRole = '#000000'

    if (highRole === '#000000') {
      if (guild.members.get(member.id) && guild.members.get(member.id)?.roles) {
        await guild.members.get(member.id)?.roles
          .map((a) => {
            const color = ctx.message.guild.roles.get(a)?.color
            if (color > 1) {
              if (highRole === 0) {
                highRole = `#${color.toString(16)}`
                return
              }
            }
          })
      }
    }
    const render = await requestTokamak({
      action: 'renderLicense',
      licenseStruct: {
        name: member.username,
        text: `${ctx._locale('commands:license.licensedFor')}: ${(member.id === ctx.message.author.id) ? ctx.args.get('text')?.value || ctx._locale('commands:license.beCute') : ctx.args.get('text')?.value || ctx._locale('commands:license.beCute')}`,
        hexColor: highRole,
        avatarUrl: ctx.message.guild.members.get(member.id)?.guildAvatar ?? member.avatarURL
      }
    })

    ctx.message.hook.createMessage('', { file: render.buffer, name: 'license.png' })
  }
}
