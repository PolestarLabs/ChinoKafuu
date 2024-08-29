import { CommandBase, CommandOptions } from 'eris'
import { Command, SlashCommandContext } from '../../../structures/util'

export default class AddRoleCommand extends Command {
  constructor() {
    super({
      name: 'addrole',
      aliases: ['adicionarcargo'],
      permissions: [{
        entity: 'both',
        permissions: ['manageRoles']
      }],
      slash: new CommandBase()
        .setName('addrole')
        .setDescription('You can get your daily yens by using this command')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention the member on the server')
            .isRequired(),
          new CommandOptions()
            .setType(8)
            .setName('role')
            .setDescription('Mention the role on the server')
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
    const user = ctx.args.get('user').value
    const member = await ctx.getMember(user?.id ?? user)
    if (!member) return ctx.replyT('error', 'basic:invalidUser')
    const role = ctx.getRole(ctx.args.get('role').value)
    if (!role) return ctx.replyT('error', 'basic:invalidRole')
    try {
      member.addRole(role.id)
      ctx.replyT('success', 'commands:addrole.success')
    } catch (err) {
      ctx.client.emit('error', (ctx.client, err))
      ctx.replyT('error', 'commands:addrole.higher')
    }
  }
}
