import { Command } from '../../../structures/util'

export default class GuildBanCommand extends Command {
  constructor() {
    super({
      name: 'guildban',
      permissions: [{
        entity: 'user',
        permissions: ['botDeveloper']
      }]
    })
  }

  async run(ctx) {
    switch (ctx.args[0]) {
      case 'add': {
        const guild = ctx.args[1]
        if (!guild) return ctx.reply('error', 'eu não posso editar algo de um servidor que não foi informado.')
        const dbGuild = await ctx.client.database.guilds.getOrCreate(guild)
        let reason = ctx.args.slice(2).join(' ')
        if (!reason) {
          reason = 'No reason'
        }
        dbGuild.blacklist = true
        dbGuild.blacklistReason = reason
        dbGuild.save().then(() => {
          ctx.reply('success', 'prontinho! Servidor adicionado a lista negra, agora ninguém mais poderá me adicionar lá, e se eu estiver lá, eu irei sair em breve.')
        })
      }
        break
      case 'view': {
        const guild = ctx.args[1]
        if (!guild) return ctx.reply('error', 'eu não posso editar algo de um servidor que não foi informado.')
        const dbGuild = await ctx.client.database.guilds.getOrCreate(guild)
        const guildInfo = ctx.client.guilds.get(dbGuild._id) ? `${ctx.client.guilds.get(dbGuild._id).name} - (${dbGuild._id})` : dbGuild._id
        const msg = `\`\`\`asciidoc\n== GUILD BANNED INFO ==\n\n• Guild :: ${guildInfo}\n• Banned :: ${dbGuild.blacklist}\n• Reason :: ${dbGuild.blacklistReason}\`\`\``
        ctx.send(msg)
      }
        break
      case 'remove': {
        const guild = ctx.args[1]
        if (!guild) return ctx.reply('error', 'eu não posso editar algo de um servidor que não foi informado.')
        const dbGuild = await ctx.client.database.guilds.getOrCreate(guild)
        dbGuild.blacklist = false
        dbGuild.blacklistReason = null
        dbGuild.save().then(() => {
          ctx.reply('success', 'prontinho! Servidor removido da lista negra, agora podem me adicionar lá novamente.')
        })
      }
        break
      default: {
        ctx.reply('warn', 'você pode escolher entre as opções `add`, `view`, `remove`.')
      }
    }
  }
}
