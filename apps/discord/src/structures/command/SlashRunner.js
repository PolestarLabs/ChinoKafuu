import { BlacklistUtils, EmbedBuilder, ErrorStack, Helper } from '../util'
import { CommandPermissions } from './CommandPermissions'
import { SlashCommandContext } from './SlashCommandContext'

export class SlashRunner {
  /**
   *
   * @param client
   * @param interaction
   * @returns {Promise<Eris.Interaction>}
   */
  static async run(client, interaction) {
    const ms = Date.now()
    const getDataDB = await client.database.flux({
      search: {
        guilds: [{ fetch: { id: interaction.guild.id }, data: { prefix: process.env.PREFIX }, getOrCreate: true }],
        users: [{ fetch: { id: interaction.member.id }, data: { shipValue: Math.floor(Math.random() * 55) }, getOrCreate: true }],
      }
    })

    const guildData = getDataDB.getQuery('guilds', (query) => query.typeQuery === interaction.guild.id)
    const userData = getDataDB.getQuery('users', (query) => query.typeQuery === interaction.member.id)

    const blacklist = new BlacklistUtils(client)
    if (await blacklist.verifyGuild(interaction.guild)) return client.leaveGuild(interaction.guild.id)
    const _locale = client.i18nRegistry.getT(guildData.data.lang)
    const commandName = interaction.command.commandName
    const command = client.slashCommandRegistry.findByName(commandName)
    if (!command) return
    const ctx = new SlashCommandContext(client, interaction, interaction.command.interface, {
      user: userData.data,
      guild: guildData.data,
      db: client.database.users
    }, _locale, { jitter: getDataDB.time.jitter, latency: getDataDB.time.latency })
    ctx.ms = ms
    if (userData?.data.blacklist === false) {
      if (command.isCommandModal === true) {
        command.setModal(ctx, interaction)
        await client.interactionManager.hookInteraction(interaction, {
          type: 9, data: command.modal
        })
      } else {
        await client.interactionManager.hookInteraction(interaction, { type: 5 })
      }
    }
    const permissions = new CommandPermissions(client, interaction.member, interaction.guild)
    if (userData?.data.blacklist) {
      const embed = new EmbedBuilder()
      embed.setColor('MODERATION')
      embed.setAuthor('Você foi banido', interaction.member.user.avatarURL)
      embed.setDescription(`Olá ${interaction.member.user.mention}, parece que você fez besteira que acabou quebrando os meus termos de uso, devido à isto, você foi banido de me usar.`)
      embed.addField('Motivo', userData.blacklistReason)
      embed.addField('Banido injustamente?', 'Se você acha que foi banido injustamente, então entre no meu servidor de suporte.')

      ctx.sendHook({ ...embed.build(), flags: 1 << 6 })
      return
    }

    const commandData = await client.database.commands.getOrCreate(interaction.command.commandName)
    if (commandData?.disable) {
      return ctx.replyT('warn', 'basic:disabledCommand', { 0: commandData.reason }, {
        flags: 1 << 6
      })
    }

    const userPermissions = permissions.userHas(command.permissions)
    const botPermissions = permissions.botHas(command.permissions)
    if (userPermissions.length > 0) {
      return ctx.replyT('error', 'basic:missingUserPermission', { perm: userPermissions.map(perms => `\`${ctx._locale(`permission:${perms}`)}\``).join(', ') }, {
        flags: 1 << 6
      })
    }

    if (botPermissions.length > 0) {
      return ctx.replyT('error', 'basic:missingBotPermission', { perm: botPermissions.map(perms => `\`${ctx._locale(`permission:${perms}`)}\``).join(', ') }, {
        flags: 1 << 6
      })
    }

    if ((command.arguments && ctx.args.size < command.arguments)) {
      const aliases = command.aliases
      const helper = new Helper(ctx, command.name, aliases, ctx._locale(`commands:${command.name}.usage`), ctx._locale(`commands:${command.name}.description`), command.permissions)
      return helper.help()
    }

    try {
      await command.run(ctx)
    } catch (errorStack) {
      console.log(errorStack)

      const errorMessage = ErrorStack(errorStack, {
        embed: true,
        hidePath: true,
        limit: 1800
      })

      const embed = new EmbedBuilder()
      embed.setColor('ERROR')
      embed.setTitle(ctx._locale('events:executionFailure.embedTitle'))
      embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``)
      embed.addField(ctx._locale('events:executionFailure.fieldTitle'), ctx._locale('events:executionFailure.fieldValue'))
      embed.addField(ctx._locale('events:executionFailure.commandExecuted'), commandName)

      if (ctx.used) {
        ctx.embeds.push(embed.build().embeds[0])
      } else {
        await ctx.send({ ...embed.build(), flags: 1 << 6 })
      }

      return
    }
  }
}