import { Command, EmbedBuilder } from '../../../structures/util'
import axios from 'axios'

export default class ChangeAvatarCommand extends Command {
  constructor() {
    super({
      name: 'changeavatar',
      permissions: [{
        entity: 'user',
        permissions: ['botDeveloper']
      }],
      aliases: ['alteraravatar']
    })
  }

  async run(ctx) {
    if (!ctx.message.attachments[0] && !ctx.args[0]) return ctx.reply('error', 'você não informou a imagem em que eu devo colocar como meu avatar.')

    const url = ctx.args[0] || ctx.message.attachments[0].url
    const request = await axios.get(url, { responseType: 'arraybuffer' }).then(d => Buffer.from(d.data, 'binary').toString('base64'))
    const base64Avatar = `data:image/${url.substring(url.length, 3)};base64,${request}`

    ctx.client.editSelf({
      avatar: base64Avatar
    }).then(client => {
      const embed = new EmbedBuilder()
      embed.setTitle('Whoa! Estou com um avatar novo!')
      embed.setImage(client.avatarURL)
      embed.setColor('DEFAULT')

      ctx.send(embed.build())
    })
  }
}
