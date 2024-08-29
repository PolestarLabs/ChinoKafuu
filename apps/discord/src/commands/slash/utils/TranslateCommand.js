import { CommandBase } from 'eris'
import { Command } from '../../../structures/util'

export default class TranslateCommand extends Command {
  constructor() {
    super({
      name: 'translate',
      aliases: ['traduzir'],
      isCommandModal: true,
      slash: new CommandBase()
        .setType()
        .setName('translate')
        .setDescription('Translate a text without having to use online translator services.')
    })
  }

  async run() { }

  setModal(ctx) {
    this.modal = {
      'title': ctx._locale('commands:translate.title'),
      'custom_id': `modal:translateInteraction`,
      'components': [
        {
          type: 1,
          components: [{
            'type': 4,
            'custom_id': 'language',
            'label': ctx._locale('commands:translate.languageLabel'),
            'style': 1,
            'min_length': 1,
            'max_length': 30,
            'placeholder': ctx._locale('commands:translate.languageText'),
            'required': true
          }]
        },
        {
          'type': 1,
          'components': [
            {
              'type': 4,
              'custom_id': 'translate',
              'label': ctx._locale('commands:translate.translateLabel'),
              'style': 2,
              'min_length': 1,
              'max_length': 4000,
              'placeholder': ctx._locale('commands:translate.translateText'),
              'required': true
            }]
        }]
    }
  }
}
