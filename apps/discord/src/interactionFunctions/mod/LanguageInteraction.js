import { InteractionFunction } from '../../structures/InteractionFunction';

export default class DivorceInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'languageInteraction',
    })
  }

  interactionFunction({ getData, defineState, edit, deleteInteraction }) {
    const { data } = getData()
    defineState.actionState.event
      .once('done', (state) => {
        if (state === 'br') {
          deleteInteraction()
          edit('success', 'agora eu irei falar em `Português, Brasil`.', {
            embeds: [],
            components: []
          })
        } else if (state === 'vn') {
          deleteInteraction()
          edit('success', 'bây giờ tôi sẽ nói `Tiếng Việt, Việt Nam`.', {
            embeds: [],
            components: []
          })
        } else if (state === 'us') {
          deleteInteraction()
          edit('success', 'now I\'ll speak `English, US`.', {
            embeds: [],
            components: []
          })
        } else if (state === 'es') {
          deleteInteraction()
          edit('success', 'ahora, hablaré en `Español`.', {
            embeds: [],
            components: []
          })
        } else if (state === 'jp') {
          deleteInteraction()
          edit('success', 'では、`日本語`で話します。', {
            embeds: [],
            components: []
          })
        } else if (state === 'fr') {
          deleteInteraction()
          edit('success', 'maintenant je vais parler en `Français`.', {
            embeds: [],
            components: []
          })
        }
      })
      .once('error', (err) => {
        deleteInteraction()
        throw err
      })
    switch (data.values[0]) {
      case 'br':
      case 'vn':
      case 'us':
      case 'es':
      case 'jp':
      case 'fr':
        defineState.actionState.setState({ action: data.values[0] })
    }

  }
}