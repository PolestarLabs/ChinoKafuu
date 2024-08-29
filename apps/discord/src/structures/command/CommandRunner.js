import { AwayFromKeyboardUtils, BlacklistUtils, EmbedBuilder, Helper, InviteDMUtils } from '../util'
import { Logger } from '../util/Logger'
import { CommandContext } from './CommandContext'
import { CommandPermissions } from './CommandPermissions'

export class CommandRunner {
  static async run(client, message) {
    if (message.author.bot) return
    if (!message.channel.guild) {
      InviteDMUtils(client, message)
      return
    }

    const userData = await client.database.users.getOrCreate(message.author.id, { shipValue: Math.floor(Math.random() * 55) })
    const guildData = await client.database.guilds.getOrCreate(message.guild.id)
    const blacklist = new BlacklistUtils(client)
    if (await blacklist.verifyGuild(message.guild)) return client.leaveGuild(message.guild.id)

    const _locale = client.i18nRegistry.getT(guildData.lang)
    AwayFromKeyboardUtils(client, message, _locale)
    if (message.content.replace('!', '') === client.user.mention) return message.channel.createMessage(_locale('basic:onMention', {
      0: message.author.mention,
      1: '/'
    }))

    // eslint-disable-next-line security/detect-non-literal-regexp
    const regexp = new RegExp(`^(${guildData.prefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}|${process.env.GLOBAL_BOT_PREFIX}|<@!?${client.user.id}>)( )*`, 'gi')

    if (!message.content.match(regexp)) return

    const args = message.content.replace(regexp, '').trim().split(/ /g)
    const commandName = args.shift().toLowerCase()

    const command = client.commandRegistry.findByName(commandName)
    if (!command) return

    const ctx = new CommandContext(client, message, args, {
      user: userData,
      guild: guildData,
      db: client.database.users
    }, _locale)

    const timeoutVanilla = new Date()

    if (!process.env.DISCORD_ACCESS_BETA.includes(message.author.id)) {
      if (message.member.permissions.has('manageGuild') && timeoutVanilla.getFullYear() < 2022) {
        const embed = new EmbedBuilder()
        embed.setColor('DEFAULT')
        embed.setTitle(ctx._locale('basic:migrate.migrateTitle'))
        embed.setDescription(ctx._locale('basic:migrate.migrateToSlashCommand', { 0: client.user.id, 1: message.guild.id, 2: ctx.db.guild.prefix }))

        if (!ctx.db.user.stopNotify) ctx.send(embed.build())
      } else if (timeoutVanilla.getFullYear() >= 2022) {
        const embed = new EmbedBuilder()
        embed.setColor('ACTION')
        embed.setTitle(ctx._locale('basic:migrate.disabledTitle'))
        embed.setDescription(ctx._locale('basic:migrate.disabledToSlashCommands'))
        embed.setImage('https://cdn.discordapp.com/attachments/653782147777298481/915690323420790854/ezgif.com-gif-maker.gif')
        embed.addField(ctx._locale('basic:migrate.howToUseTitle'), ctx._locale('basic:migrate.howToUseSlash', { 0: client.user.id, 1: message.guild.id }))
        embed.addField(ctx._locale('basic:migrate.needSupportTitle'), ctx._locale('basic:migrate.needSupportSlash'))

        return ctx.send(embed.build())
      }
    }

    const permissions = new CommandPermissions(client, message.member, message.guild)
    try {
      const botPermissionsOnChannel = permissions.botHasOnChannel(message.channel, [{
        entity: 'bot',
        permissions: ['sendMessages', 'readMessageHistory']
      }])

      if (botPermissionsOnChannel.length > 0) {
        const channel = await message.author.getDMChannel()
        return channel.createMessage(_locale(`basic:missingBotPermissionOnChannel`, { 0: message.author.mention, 1: botPermissionsOnChannel.map(perm => `\`${_locale(`permission:${perm}`)}\``).join(', '), 2: message.channel.mention }))
      }
    } catch {
      return
    }
    if (typeof client.commandCooldown.users.get(message.author.id) === 'undefined') {
      client.commandCooldown.addUser(message.author.id, command.cooldown * 1000)
    } else {
      try {
        const userLimited = client.commandCooldown.users.get(message.author.id)
        userLimited.request++
        if (userLimited.request > userLimited.requestLimit) {
          if (!(userLimited._try > 2)) {
            // This is to avoid long time. Not to reach 1 billion years.
            client.commandCooldown.removeUser(message.author.id)
            client.commandCooldown._addUserStress(
              message.author.id,
              userLimited._commandCooldown + command.cooldown * 1000,
              userLimited.requestLimit + 10,
              userLimited._try += 1
            )
          } else {
            userLimited.user_was_warned = true
            return
          }
          if (!userData.user_was_warned) {
            const time = new Date(new Date(userLimited.timeSet - Date.now())).getSeconds()
            ctx.replyT('error', 'I\'m limiting your command usage by too many command requests, wait for \\`{time}\\` seconds and try again.', { 0: (time <= 0) ? _locale('basic:cooldownLowThanZero') : `\`${time}\`` })
          }
          return
        }

        if (!userLimited._warn) {
          const time = new Date(new Date(userLimited.timeSet - Date.now())).getSeconds()
          ctx.replyT('error', 'basic:cooldown', { 0: (time <= 0) ? _locale('basic:cooldownLowThanZero') : `\`${time}\`` })
          userLimited._warn = true
        }
      } catch {
        return
      }
      return
    }
    if (userData?.blacklist) {
      const embed = new EmbedBuilder()
      embed.setColor('MODERATION')
      embed.setAuthor('Você foi banido', message.author.avatarURL)
      embed.setDescription(`Olá ${message.author.mention}, parece que você fez besteira que acabou quebrando os meus termos de uso, devido à isto, você foi banido de me usar.`)
      embed.addField('Motivo', userData.blacklistReason)
      embed.addField('Banido injustamente?', 'Se você acha que foi banido injustamente, então entre no meu servidor de suporte.')

      ctx.send(embed.build())
      return
    }

    await ctx.message.channel.sendTyping()
    const commandData = await client.database.commands.getOrCreate(command.name)
    if (commandData?.disable) {
      return ctx.replyT('warn', 'basic:disabledCommand', { 0: commandData.reason })
    }

    const userPermissions = permissions.userHas(command.permissions)
    const botPermissions = permissions.botHas(command.permissions)
    const botPermissionsOnChannel = permissions.botHasOnChannel(message.channel, command.permissions)

    if (botPermissionsOnChannel.length > 0) {
      return message.channel.createMessage(_locale(`basic:missingBotPermissionOnChannel`, { 0: message.author.mention, 1: botPermissionsOnChannel.map(perm => `\`${_locale(`permission:${perm}`)}\``).join(', '), 2: message.channel.mention }))
    }

    if (userPermissions.length > 0) {
      return ctx.replyT('error', `basic:missingUserPermission`, { perm: userPermissions.map(perms => `\`${ctx._locale(`permission:${perms}`)}\``).join(', ') })
    }
    if (botPermissions.length > 0) {
      return ctx.replyT('error', `basic:missingBotPermission`, { perm: botPermissions.map(perms => `\`${ctx._locale(`permission:${perms}`)}\``).join(', ') })
    }

    if ((command.arguments && ctx.args.length < command.arguments) || (command.arguments && !ctx.args[0])) {
      const aliases = command.aliases
      const helper = new Helper(ctx, command.name, aliases, ctx._locale(`commands:${command.name}.description`), command.permissions)
      return helper.help()
    }

    try {
      await command.run(ctx)
    } catch (e) {
      Logger.error(e.debug({ guild_id: message.guild.id, shard_id: message.guild.shard, user_id: message.member?.user?.id ?? message?.user?.id, isSlash: false }, true))
      const errorMessage = e.stack.length > 1800 ? `${e.stack.slice(0, 1800)}...` : e.stack
      client.emit('error', e, message.guild.shard)
      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle(ctx._locale('events:executionFailure.embedTitle'))
      embed.setDescription(`\`\`\`js\n${errorMessage.removePath()}\`\`\``)
      embed.addField(ctx._locale('events:executionFailure.fieldTitle'), ctx._locale('events:executionFailure.fieldValue'))
      return ctx.send(embed.build())
    }
  }
}
