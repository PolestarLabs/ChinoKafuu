import { Command } from '../../../structures/util'

export default class EditYensCommand extends Command {
  constructor() {
    super({
      name: 'edityens',
      permissions: [{
        entity: 'user',
        permissions: ['botDeveloper']
      }]
    })
  }

  async run(ctx) {
    switch (ctx.args[0]) {
      case 'add': {
        const user = await ctx.getUser(ctx.args[1])
        if (!user) return ctx.reply('error', 'eu não posso editar algo de uma pessoa que não foi informada.')
        const dbUser = await ctx.db.db.getOrCreate(user.id)
        const amount = ctx.args[2]
        if (!amount) return ctx.reply('error', 'você não falou o valor que você deseja adicionar para o usuário.')
        dbUser.yens += Math.round(amount)
        dbUser.save().then(() => {
          ctx.reply('success', 'prontinho! Eu adicionei o valor desejado para o usuário.')
        })
      }
        break
      case 'edit': {
        const user = await ctx.getUser(ctx.args[1])
        if (!user) return ctx.reply('error', 'eu não posso editar algo de uma pessoa que não foi informada.')
        const dbUser = await ctx.db.db.getOrCreate(user.id)
        const amount = ctx.args[2]
        if (!amount) return ctx.reply('error', 'você não falou o valor que você deseja alterei para o usuário.')
        dbUser.yens = Math.round(amount)
        dbUser.save().then(() => {
          ctx.reply('success', 'prontinho! Eu alterei o valor desejado do usuário.')
        })
      }
        break
      case 'remove': {
        const user = await ctx.getUser(ctx.args[1])
        if (!user) return ctx.reply('error', 'eu não posso editar algo de uma pessoa que não foi informada.')
        const dbUser = await ctx.db.db.getOrCreate(user.id)
        const amount = ctx.args[2]
        if (!amount) return ctx.reply('error', 'você não falou o valor que você deseja remover para o usuário.')
        dbUser.yens -= Math.round(amount)
        dbUser.save().then(() => {
          ctx.reply('success', 'prontinho! Eu removi o valor desejado do usuário.')
        })
      }
        break
      default: {
        ctx.reply('warn', 'você pode escolher entre as opções `add`, `edit`, `remove`.')
      }
    }
  }
}
