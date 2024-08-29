export const AwayFromKeyboardUtils = async (client, message, locale) => {
  const userData = await client.database.users.findOneByID(message.author.id)
  if (userData.afk) {
    userData.afk = false
    userData.afkReason = ''
    userData.save()
    if (!message.channel.permissionsOf(client.user.id).has('sendMessages')) return
    await message.channel.createMessage(locale('basic:afkRemoval', { user: message.author.mention }))
  }

  for (const user of message.mentions) {
    const afkUser = await client.database.users.findOneByID(user.id)

    if (!afkUser?.afk) break
    if (!message.channel.permissionsOf(client.user.id).has('sendMessages')) return
    await message.channel.createMessage(afkUser.afkReason ? locale('basic:onMentionAfkReasoned', {
      user: user.username,
      reason: afkUser.afkReason
    }) : locale('basic:onMentionAfk', { user: user.username }))
  }
}