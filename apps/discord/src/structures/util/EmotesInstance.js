import  { Emojis } from './Emojis'

export const Emoji = {
  getEmoji: function getEmoji(emoji) {
    if (!Emojis[typeof emoji === 'string' ? emoji : '🐛']) {
      return emoji = {
        name: '🐛',
        id: '🐛',
        mention: '🐛',
        reaction: '🐛'
      }
    }

    const emojiSplit = Emojis[typeof emoji === 'string' ? emoji : '🐛'].replace(/(<:)/g, '').replace(/(<a:)/g, '').replace(/(>)/g, '').trim().split(':')
    const objectEmoji = {
      name: emojiSplit[0],
      id: (emojiSplit[1] !== undefined) ? emojiSplit[1] : emojiSplit[0],
      mention: Emojis[typeof emoji === 'string' ? emoji : '🐛'],
      reaction: (emojiSplit[1] !== undefined) ? `${emojiSplit[0]}:${emojiSplit[1]}` : `${emojiSplit[0]}`
    }

    return objectEmoji
  }
}