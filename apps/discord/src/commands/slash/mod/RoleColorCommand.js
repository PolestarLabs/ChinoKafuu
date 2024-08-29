import { Command, SlashCommandContext } from '../../../structures/util'
import { CommandBase, CommandOptions } from 'eris'

export default class RoleColorCommand extends Command {
  constructor() {
    super({
      name: 'rolecolor',
      aliases: [],
      permissions: [{
        entity: 'both',
        permissions: ['manageRoles']
      }],
      slash: new CommandBase()
        .setName('rolecolor')
        .setDescription('Changes the color of a role.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('role')
            .setDescription('Mention role on server.')
            .isRequired(),
          new CommandOptions()
            .setType(3)
            .setName('color')
            .setDescription('For example: #f55f96')
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
    const getRole = ctx.args.get('role').value
    const role = ctx.message.guild.roles.find(role => role.name.toLowerCase().includes(getRole)) || ctx.message.guild.roles.get(getRole.replace(/[<@&>]/g, ''))
    const color = ctx.args.get('color').value
    if (!role) return ctx.replyT('error', 'basic:invalidRole')
    if (!color?.startsWith('#')) return ctx.replyT('error', 'commands:rolecolor.invalidColor')

    try {
      await role.edit({
        color: parseInt(`0x${color.replace('#', '').toString(16)}`)
      })
      ctx.replyT('success', 'commands:rolecolor.colorChanged')
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      ctx.replyT('error', 'commands:rolecolor.higher')
    }
  }
}
