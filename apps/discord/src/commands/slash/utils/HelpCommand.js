import { CommandBase, CommandOptions } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Options } from '../../../structures/interactions/Options'
import { SelectionMenu } from '../../../structures/interactions/SelectionMenu'
// eslint-disable-next-line no-unused-vars
import { Button, Command, EmbedBuilder, Emoji, Helper, SlashCommandContext } from '../../../structures/util'

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
    if (ctx.args.get('command')?.value || command.findByName(ctx.args.get('command')?.value?.toLowerCase())) {
      const helper = new Helper(ctx, command.findByName(ctx.args.get('command').value.toLowerCase()).name, command.findByName(ctx.args.get('command').value?.toLowerCase()).aliases, ctx._locale(`commands:${command.findByName(ctx.args.get('command').value?.toLowerCase()).name}.description`), command.findByName(ctx.args.get('command').value?.toLowerCase()).permissions, true)
      return helper.help()
    }
    const categories = [
      ctx._locale('commands:help.economy.title', { 0: filterByCategory('economy').length }),
      ctx._locale('commands:help.fun.title', { 0: filterByCategory('fun').length }),
      ctx._locale('commands:help.image.title', { 0: filterByCategory('image').length }),
      ctx._locale('commands:help.minecraft.title', { 0: filterByCategory('minecraft').length }),
      ctx._locale('commands:help.misc.title', { 0: filterByCategory('misc').length }),
      ctx._locale('commands:help.mod.title', { 0: filterByCategory('mod').length }),
      ctx._locale('commands:help.social.title', { 0: filterByCategory('social').length }),
      ctx._locale('commands:help.utils.title', { 0: filterByCategory('utils').length })

    ]
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setThumbnail(ctx.client.user.avatarURL)
    embed.setTitle(ctx._locale('commands:help.commandList'))
    embed.setDescription(ctx._locale('commands:help.explain', { 0: slashCommands.find((cmd) => cmd.name === 'help').mention, 1: categories.join('\n') }))
    embed.setTimestamp()
    embed.setFooter(ctx._locale('commands:help.commandsLoaded', { 0: commandLength }))
    embed.addField(ctx._locale('commands:help.additionalLinks.embedTitle'), ctx._locale('commands:help.additionalLinks.embedDescription', { 0: ctx.client.user.id }))

    const home_button = new Button()
      .customID('home_button')
      .setStyle(1)
      .setEmoji({
        name: Emoji.getEmoji('home').name,
        id: Emoji.getEmoji('home').id
      })

    const menu = new SelectionMenu()
      .addPlaceHolder(ctx._locale('commands:help.select_category'))
      .setCustomID('category_menu')
      .addItem(
        new Options()
          .setLabel(ctx._locale('commands:help.economy.title', { 0: filterByCategory('economy').length }))
          .addDescription(ctx._locale('commands:help.economy.description'))
          .setValue('economy')
          .addEmoji({
            name: Emoji.getEmoji('yen').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.fun.title', { 0: filterByCategory('fun').length }))
          .addDescription(ctx._locale('commands:help.fun.description'))
          .setValue('fun')
          .addEmoji({
            name: Emoji.getEmoji('yen').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.image.title', { 0: filterByCategory('image').length }))
          .addDescription(ctx._locale('commands:help.image.description'))
          .setValue('image')
          .addEmoji({
            name: Emoji.getEmoji('photo_frame').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.minecraft.title', { 0: filterByCategory('minecraft').length }))
          .addDescription(ctx._locale('commands:help.minecraft.description'))
          .setValue('minecraft')
          .addEmoji({
            name: Emoji.getEmoji('minecraft').name,
            id: Emoji.getEmoji('minecraft').id
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.misc.title', { 0: filterByCategory('misc').length }))
          .addDescription(ctx._locale('commands:help.misc.description'))
          .setValue('misc')
          .addEmoji({
            name: Emoji.getEmoji('yen').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.mod.title', { 0: filterByCategory('mod').length }))
          .addDescription(ctx._locale('commands:help.mod.description'))
          .setValue('mod')
          .addEmoji({
            name: Emoji.getEmoji('tools').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.social.title', { 0: filterByCategory('social').length }))
          .addDescription(ctx._locale('commands:help.social.description'))
          .setValue('social')
          .addEmoji({
            name: Emoji.getEmoji('cityscape').mention
          }),
        new Options()
          .setLabel(ctx._locale('commands:help.utils.title', { 0: filterByCategory('utils').length }))
          .addDescription(ctx._locale('commands:help.utils.description'))
          .setValue('utils')
          .addEmoji({
            name: Emoji.getEmoji('tip').mention
          })
      )

    ctx.interaction().components(menu).components(home_button.build()).returnCtx().send(embed.build()).then(async msg => {
      const state = defineState({
        action: ''
      }, { eventEmitter: true })
      ctx.createInteractionFunction('helpInteraction', msg, {
        state,
        users: [ctx.message.author.id]
      })
      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        try {
          state.actionState.event.emit('done', (stateUpdated.action))
        } catch (err) {
          state.actionState.event.emit('error', err)
        }
      }).once('error', (err) => {
        throw err
      })
    })
  }
}
