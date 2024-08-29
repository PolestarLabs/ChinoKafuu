import { Command } from '../../../structures/util'

export default class ManageCmdCommand extends Command {
  constructor() {
    super({
      name: 'managecmd',
      permissions: [{
        entity: 'user',
        permissions: ['botDeveloper']
      }]
    })
  }

  async run(ctx) {
    switch (ctx.args[0]) {
      case 'add': {
        const command = ctx.args[1]
        if (!command) return ctx.reply('error', 'I can\'t edit something about this command, because you didn\'t nothing.')
        const dbCommand = await ctx.client.database.commands.getOrCreate(command)
        let reason = ctx.args.slice(2).join(' ')
        if (!reason) {
          reason = 'No reason'
        }
        dbCommand.disable = true
        dbCommand.reason = reason
        dbCommand.save().then(() => {
          ctx.reply('success', 'done! This command is now disabled for my security.')
        })
      }
        break
      case 'view': {
        const command = ctx.args[1]
        if (!command) return ctx.reply('error', 'I can\'t edit something about this command, because you didn\'t nothing.')
        const dbCommand = await ctx.client.database.commands.getOrCreate(command)
        const msg = `\`\`\`asciidoc\n== COMMAND INFO ==\n\n• Guild :: ${dbCommand.id}\n• Disabled :: ${dbCommand.disable}\n• Reason :: ${dbCommand.reason}\`\`\``

        ctx.send(msg)
      }
        break
      case 'remove': {
        const command = ctx.args[1]
        if (!command) return ctx.reply('error', 'I can\'t edit something about this command, because you didn\'t nothing.')
        const dbCommand = await ctx.client.database.commands.getOrCreate(command)
        dbCommand.disable = false
        dbCommand.reason = null
        dbCommand.save().then(() => {
          ctx.reply('success', 'done! Now this commands is now enable, everyone can use it again.')
        })
      }
        break
      default: {
        ctx.reply('warn', 'you need choose an options: `add`, `view`, `remove`.')
      }
    }
  }
}
