import { Command, EmbedBuilder, SlashCommandContext } from '../../../../structures/util'

export default class UserInfoCommand extends Command {
  constructor() {
    super({
      name: 'user info',
      aliases: [],
      permissions: [{
        entity: 'bot',
        permissions: ['embedLinks']
      }]
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const user = ctx.args.get('user')?.value
    const member = await ctx.getUser(user?.id ?? user, true)
    let hoist
    const guildMember = await ctx.getMember(member.id)
    const avatar = guildMember?.guildAvatar ?? member.avatarURL
    const guild = ctx.message.guild
    if (guildMember) {
      const role = guildMember.roles
        .map((a) => ctx.message.guild.roles.get(a))
        .filter((z) => z && z.color >= 0)
        .sort((a, b) => b.position - a.position)
      hoist = role[0]
    }

    const highRole = guild.roles.get(hoist?.id)
    const embed = new EmbedBuilder()
    embed.setColor(`#${highRole?.color.toString(16)}` ?? null)
    embed.setThumbnail(avatar)
    embed.addField(ctx._locale('commands:userinfo.username'), `@${member.username}`, true)
    embed.addField(ctx._locale('commands:userinfo.userid'), member.id, true)
    embed.addField(ctx._locale('commands:userinfo.createdAt'), `<t:${parseInt(member.createdAt / 1000).toFixed(0)}:F>`, true)
    guildMember ? embed.addField(ctx._locale('commands:userinfo.joinedAt'), `<t:${parseInt(guildMember.joinedAt / 1000).toFixed(0)}:F> (<t:${parseInt(guildMember.joinedAt / 1000).toFixed(0)}:R>)`, true) : null
    guildMember ? embed.addField(ctx._locale('commands:userinfo.highRole'), highRole?.mention, true) : null

    if (guildMember?.premiumSince !== null && guildMember?.premiumSince !== undefined) {
      embed.addField(ctx._locale('commands:userinfo.boostSince'), `<t:${parseInt(new Date(guildMember?.premiumSince).getTime() / 1000)
        .toFixed(0)}:F> (<t:${parseInt(new Date(guildMember?.premiumSince).getTime() / 1000).toFixed(0)}:R>)`, true)
    }
    guildMember ? embed.addField(ctx._locale('commands:userinfo.hasPermissions'), guildMember?.permissions?.array?.map(perm => `\`${ctx._locale(`permission:${perm}`)}\``)?.join(', ')) : null

    ctx.send(embed.build())
  }
}
