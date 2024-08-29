import { EmbedBuilder } from './EmbedBuilder'
import { Logger } from './Logger'

export const InviteDMUtils = async (client, message) => {
  const isInvite = (/((?:discord\.gg|discordapp\.com\/invite|discord\.com\/invite))/g).test(message.content)
  if (isInvite) {
    try {
      const dmChannel = await message.author.getDMChannel()
      const text = message.content.trim().split(' ')
      const findInvite = text.find(invite => invite.includes('discord.gg'))
        .replace('https:', '')
        .replace(/((?:discord\.gg|discordapp\.com\/invite|discord\.com\/invite))/g, '')
        .replace(/(\/)/g, '')

      const invite = await client.getInvite(findInvite)
      const embed = new EmbedBuilder()
      embed.setColor('DEFAULT')
      embed.setAuthor(message.author.username, message.author.avatarURL)
      embed.setThumbnail(invite.guild.iconURL)
      embed.setDescription(`Hey, here is my invite to add me on \`${invite.guild.name}\`:\n\n[Minimal permissions](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=71158976&guild_id=${invite.guild.id})\n[Recommended permissions](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8560045566&guild_id=${invite.guild.id})`)
      dmChannel.createMessage(embed.build())
    } catch (err) {
      return Logger.debug('The invite is invalid or has already expired')
    }
  }
}