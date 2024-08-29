import axios from 'axios';
import { EmbedPage } from '../../structures/EmbedPage';
import { InteractionFunction } from '../../structures/InteractionFunction';
import { EmbedBuilder, TranslatorUtils } from '../../structures/util';

export default class TranslateInteraction extends InteractionFunction {
  constructor() {
    super({
      name: 'translateInteraction'
    })
  }

  async interactionFunction({ getData, defineState, editT, ctx, deleteInteraction, sendEmbedPage, getArg, trackingCommand }) {
    const { data, member, id } = getData()
    const language = data.components[0].components[0].value
    const content = data.components[1].components[0].value
    const embed = new EmbedPage(null, {
      users: [member.user.id],
      id
    }, ctx)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${TranslatorUtils(language)}&dt=t&q=${content}&ie=UTF-8&oe=UTF-8`
    const res = await axios.get(encodeURI(url), { responseType: 'json' })
    const dataTranslate = res.data
      .filter((i) => Array.isArray(i))
      .flatMap((i) => i)
      .filter((i) => Array.isArray(i) && !(i.length <= 1))
      .map((i) => Array.isArray(i) ? i[0] : null)
    const textComponents = dataTranslate.join(' ').split(/([^]{1,4093})/g)
      .filter((i) => i.length >= 1)
      .map((i) => this.#prepareEmbed(ctx, i.length >= 4093 - 3 ? i + '...' : i))

    embed.addComponents(...textComponents)
    await sendEmbedPage(embed)
  }

  #prepareEmbed(ctx, desc) {
    return new EmbedBuilder()
      .setColor('DEFAULT')
      .setTitle('Translation')
      .setDescription(desc)
  }

  typeInteraction() {
    return ['modal']
  }
}