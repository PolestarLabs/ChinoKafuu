import { CommandBase, CommandOptions } from 'eris'
import { Command, EmbedBuilder, SlashCommandContext } from '../../../structures/util'
import { Helper } from '../../../structures/util/Helper'

export default class HelpCommand extends Command {
  constructor() {
    super({
      name: 'help',
      aliases: ['ajuda', 'comandos', 'commands'],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }],
      slash: new CommandBase()
        .setName('help')
        .setDescription('Command Help for more information about commands.')
        .addOptions(
          new CommandOptions()
            .setType(3)
            .setName('command')
            .setDescription('Command name')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const slashCommands = ctx.client.commands.map((i) => {
      const commands = []

      if (i?.options !== undefined) {
        const options = i.options.filter((option) => option.type === 2 || option.type === 1) ?? []
        options.map((option) => {
          const name = [i.name, option.name]
          commands.push({ name: name.join(' '), hasSubCommand: true, autocomplete: option.autocomplete ?? false, mention: `**</${name.join(' ')}:${i.id}>**` })
        })
      }

      if (commands.length <= 0) {
        commands.push([{ name: i.name, id: i.id, hasSubCommand: i.options !== undefined, mention: `**</${i.name}:${i.id}>**`, autocomplete: false }])
      }
      return commands
    }).flatMap((i) => i.flatMap((option) => option))
    const command = ctx.client.slashCommandRegistry
    const count = ctx.client.commands.length
    const commandLength = count > 0 ? count : command.filterByCategory('economy').length + command.filterByCategory('fun').length + command.filterByCategory('minecraft').length + command.filterByCategory('misc').length + command.filterByCategory('mod').length + command.filterByCategory('social').length + command.filterByCategory('utils').length + command.filterByCategory('image').length
    const filterByCategory = (category) => command.filterByCategory(category).filter((command) => command.name !== undefined && command.isBase === false)
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setThumbnail(ctx.client.user.avatarURL)
    embed.setTitle(ctx._locale('commands:help.commandList'))
    embed.setDescription(ctx._locale('commands:help.explain', { 0: '/' }))
    embed.setTimestamp()
    embed.setFooter(ctx._locale('commands:help.commandsLoaded', { 0: commandLength }))
    embed.addField(ctx._locale('commands:help.economy', { 0: filterByCategory('economy').length }), filterByCategory('economy').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.fun', { 0: filterByCategory('fun').length }), filterByCategory('fun').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.image', { 0: filterByCategory('image').length }), filterByCategory('image').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.minecraft', { 0: filterByCategory('minecraft').length }), filterByCategory('minecraft').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.misc', { 0: filterByCategory('misc').length }), filterByCategory('misc').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.mod', { 0: filterByCategory('mod').length }), filterByCategory('mod').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.social', { 0: filterByCategory('social').length }), filterByCategory('social').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.utils', { 0: filterByCategory('utils').length }), filterByCategory('utils').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``}`).join(', '))
    embed.addField(ctx._locale('commands:help.additionalLinks.embedTitle'), ctx._locale('commands:help.additionalLinks.embedDescription', { 0: ctx.client.user.id }))

    if (!ctx.args.get('command')?.value) return ctx.send(embed.build())
    if (!command.findByName(ctx.args.get('command').value?.toLowerCase())) return ctx.send(embed.build())
    const helper = new Helper(ctx, command.findByName(ctx.args.get('command').value.toLowerCase()).name, command.findByName(ctx.args.get('command').value?.toLowerCase()).aliases, ctx._locale(`commands:${command.findByName(ctx.args.get('command').value?.toLowerCase()).name}.description`), command.findByName(ctx.args.get('command').value?.toLowerCase()).permissions, true)
    return helper.help()
  }
}
