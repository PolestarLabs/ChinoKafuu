import { InteractionFunction } from '../../structures/InteractionFunction';
import { Button, EmbedBuilder, Emoji } from '../../structures/util';
import { Options } from '../../structures/interactions/Options'
import { SelectionMenu } from '../../structures/interactions/SelectionMenu'

export default class HelpInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'helpInteraction'
    })
  }

  async interactionFunction({ getData, defineState, ctx, editMessage }) {
    const { data } = getData()
    const interaction = data?.values ? data?.values[0] : data.custom_id

    const slashCommands = ctx.client.commands.map((i) => {
      const commands = []

      if (i?.options !== undefined) {
        const options = i.options.filter((option) => option.type === 2 || option.type === 1) ?? []
        options.map((option) => {
          const name = [i.name, option.name]
          commands.push({ name: name.join(' '), description: option.description, hasSubCommand: true, autocomplete: option.autocomplete ?? false, mention: `**</${name.join(' ')}:${i.id}>**` })
        })
      }

      if (commands.length <= 0) {
        commands.push([{ name: i.name, id: i.id, description: i.description, hasSubCommand: i.options !== undefined, mention: `**</${i.name}:${i.id}>**`, autocomplete: false }])
      }
      return commands
    }).flatMap((i) => i.flatMap((option) => option))
    const command = ctx.client.slashCommandRegistry
    const count = ctx.client.commands.length
    const commandLength = count > 0 ? count : command.filterByCategory('economy').length + command.filterByCategory('fun').length + command.filterByCategory('minecraft').length + command.filterByCategory('misc').length + command.filterByCategory('mod').length + command.filterByCategory('social').length + command.filterByCategory('utils').length + command.filterByCategory('image').length
    const filterByCategory = (category) => command.filterByCategory(category).filter((command) => command.name !== undefined && command.isBase === false)
    const home_button = new Button()
      .customID('home_button')
      .setStyle(1)
      .setEmoji({
        name: Emoji.getEmoji('home').name,
        id: Emoji.getEmoji('home').id
      })

    const select_menu = new SelectionMenu()
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
            name: Emoji.getEmoji('sharo_hug_chino').name,
            id: Emoji.getEmoji('sharo_hug_chino').id
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
            name: Emoji.getEmoji('books').mention
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
    const embed = new EmbedBuilder()
    defineState.actionState.event
      .on('done', (state) => {
        switch (state) {
          case 'economy':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.economy.title', { 0: filterByCategory('economy').length }), filterByCategory('economy').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed] })
            break;
          case 'fun':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.fun.title', { 0: filterByCategory('fun').length }), filterByCategory('fun').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'image':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.image.title', { 0: filterByCategory('image').length }), filterByCategory('image').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'minecraft':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.minecraft.title', { 0: filterByCategory('minecraft').length }), filterByCategory('minecraft').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'misc':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.misc.title', { 0: filterByCategory('misc').length }), filterByCategory('misc').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'mod':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.mod.title', { 0: filterByCategory('mod').length }), filterByCategory('mod').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'social':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.social.title', { 0: filterByCategory('social').length }), filterByCategory('social').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'utils':
            embed.setColor('DEFAULT')
            embed.addField(ctx._locale('commands:help.utils.title', { 0: filterByCategory('utils').length }), filterByCategory('utils').map(cmd => `${slashCommands.find((command) => command.name === cmd.name)?.mention ?? `\`/${cmd.name}\``} » ${slashCommands.find((command) => command.name === cmd.name)?.description ?? cmd?.description}`).join('\n'))
            editMessage({ embeds: [embed], components: [{ type: 1, components: [select_menu] }, { type: 1, components: [home_button.build()] }] })
            break;
          case 'home_button':
            // eslint-disable-next-line no-case-declarations
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
            embed.setColor('DEFAULT')
            embed.setThumbnail(ctx.client.user.avatarURL)
            embed.setTitle(ctx._locale('commands:help.commandList'))
            embed.setDescription(ctx._locale('commands:help.explain', { 0: slashCommands.find((cmd) => cmd.name === 'help').mention, 1: categories.join('\n') }))
            embed.setTimestamp()
            embed.setFooter(ctx._locale('commands:help.commandsLoaded', { 0: commandLength }))
            embed.addField(ctx._locale('commands:help.additionalLinks.embedTitle'), ctx._locale('commands:help.additionalLinks.embedDescription', { 0: ctx.client.user.id }))
            editMessage({ embeds: [embed] })
        }
      }).once('error', (err) => {
        throw err
      })
    switch (interaction) {
      case 'economy':
      case 'fun':
      case 'image':
      case 'minecraft':
      case 'misc':
      case 'mod':
      case 'social':
      case 'utils':
      case 'home_button':
        defineState.actionState.setState({ action: interaction })
    }
  }
}