import { CommandBase } from 'eris'
import { defineState } from '../../../defineTypes/defineState'
import { Options } from '../../../structures/interactions/Options'
import { SelectionMenu } from '../../../structures/interactions/SelectionMenu'
import { Command, EmbedBuilder, Emoji, SlashCommandContext } from '../../../structures/util'

export default class LanguageCommand extends Command {
  constructor() {
    super({
      name: 'language',
      aliases: ['lang', 'idioma'],
      permissions: [{
        entity: 'user',
        permissions: ['manageGuild']
      }, {
        entity: 'bot',
        permissions: ['embedLinks', 'addReactions']
      }],
      slash: new CommandBase()
        .setName('language')
        .setDescription('Change my language in the current guild.')
    })
  }

  /**
     * @method run
     * @param {SlashCommandContext} ctx
     * @returns {void}
     */
  async run(ctx) {
    const languages = [
      `${Emoji.getEmoji('brazil').mention} **Português, Brasil**`,
      `${Emoji.getEmoji('vn').mention} **Tiếng Việt, Việt Nam**`,
      `${Emoji.getEmoji('usa').mention} **English, US**`,
      `${Emoji.getEmoji('es').mention} **Espanõl**`,
      `${Emoji.getEmoji('ja').mention} **日本語**`,
      `${Emoji.getEmoji('fr').mention} **Français**`
    ]
    const embed = new EmbedBuilder()
    embed.setColor('DEFAULT')
    embed.setAuthor(ctx._locale('commands:language.message'), ctx.message.author.avatarURL)
    embed.setDescription(languages.join('\n'))
    embed.addField(ctx._locale('commands:language.helpUs'), ctx._locale('commands:language.explaining'))
    const selectionMenu = new SelectionMenu()
      .addItem(
        new Options()
          .addEmoji({ name: Emoji.getEmoji('brazil').mention })
          .setLabel('Português, Brasil')
          .setValue('br'),
        new Options()
          .addEmoji({ name: Emoji.getEmoji('vn').mention })
          .setLabel('Tiếng Việt, Việt Nam')
          .setValue('vn'),
        new Options()
          .addEmoji({ name: Emoji.getEmoji('usa').mention })
          .setLabel('English, US')
          .setValue('us'),
        new Options()
          .addEmoji({ name: Emoji.getEmoji('es').mention })
          .setLabel('Español')
          .setValue('es'),
        new Options()
          .addEmoji({ name: Emoji.getEmoji('ja').mention })
          .setLabel('日本語')
          .setValue('jp'),
        new Options()
          .addEmoji({ name: Emoji.getEmoji('fr').mention })
          .setLabel('Français')
          .setValue('fr')

      )
      .addPlaceHolder(ctx._locale('commands:language.chooseYourLanguage'))
      .setCustomID('language-select')
    const state = defineState({
      action: ''
    }, { eventEmitter: true })
    ctx.interaction().components(selectionMenu).returnCtx().send(embed.build()).then(async message => {
      ctx.createInteractionFunction('languageInteraction', message, {
        state,
        users: [ctx.message.author.id]
      })
      state.actionState.event.on('stateUpdated', (stateUpdated) => {
        if (stateUpdated.action === 'br') {
          ctx.db.guild.lang = 'pt-BR'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        } else if (stateUpdated.action === 'vn') {
          ctx.db.guild.lang = 'vi-VN'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        } else if (stateUpdated.action === 'us') {
          ctx.db.guild.lang = 'en-US'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        } else if (stateUpdated.action === 'es') {
          ctx.db.guild.lang = 'es-ES'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        } else if (stateUpdated.action === 'jp') {
          ctx.db.guild.lang = 'ja-JP'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        } else if (stateUpdated.action === 'fr') {
          ctx.db.guild.lang = 'fr-FR'
          ctx.db.guild.save()
            .then(() => state.actionState.event.emit('done', (stateUpdated.action)))
            .catch((err) => state.actionState.event.emit('error', err))
        }

      })
    })
  }
}
