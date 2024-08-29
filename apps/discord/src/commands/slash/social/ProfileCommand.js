import { CommandBase, CommandOptions } from 'eris'
import { requestTokamak } from '../../../lib'
import { Command, Logger, SlashCommandContext } from '../../../structures/util'

const flags = [
  {
    flag: 1 << 0,
    name: 'discord_employee'
  },
  {
    flag: 1 << 1,
    name: 'discord_partner'
  },
  {
    flag: 1 << 2,
    name: 'hypesquad_events'
  },
  {
    flag: 1 << 3,
    name: 'bug_hunter'
  },
  {
    flag: 1 << 6,
    name: 'hypesquad_bravery'
  },
  {
    flag: 1 << 7,
    name: 'hypesquad_brilliance'
  },
  {
    flag: 1 << 8,
    name: 'hypesquad_balance'
  },
  {
    flag: 1 << 9,
    name: 'early_supporter'
  },
  {
    flag: 1 << 12,
    name: 'null'
  },
  {
    flag: 1 << 14,
    name: 'bug_hunter'
  },
  {
    flag: 1 << 17,
    name: 'bot_developer'
  }

]

export default class ProfileCommand extends Command {
  constructor() {
    super({
      name: 'profile',
      aliases: ['perfil'],
      permissions: [{
        entity: 'bot',
        permissions: ['attachFiles']
      }],
      slash: new CommandBase()
        .setName('profile')
        .setDescription('Shows your social profile or the social profile of someone.')
        .addOptions(
          new CommandOptions()
            .setType(6)
            .setName('user')
            .setDescription('Mention member on server.')
        )
    })
  }

  /**
   * @method run
   * @param {SlashCommandContext} ctx
   * @returns {void}
   */
  async run(ctx) {
    const user1 = ctx.args.get('user')?.value
    const member = await ctx.getUser(user1?.id ?? user1, true)
    const user = await ctx.client.database.users.getOrCreate(member.id)
    const couple = user.isMarry ? await ctx.getUser(user.marryWith) : { username: '', discriminator: '' }

    const arrayBadges = [
      /**
             * This is a badge list.
             */
    ]

    for (const flag of flags) {
      switch ((flag.flag & member?.user?.publicFlags ?? member.publicFlags) === flag.flag) {
        case true:
          arrayBadges.push(flag.name)
          break
      }
    }

    const guildMember = await ctx.getMember(member.id) ?? undefined
    const a = Date.now()
    const cache = ctx.client.pluginManager.pluginStore.get('cache_profile').classState
    const data = {
      type: user.profileType,
      name: member.username,
      money: Number(user.yens).toLocaleString(),
      aboutMe: user.aboutme !== '' ? user.aboutme : ctx._locale('commands:profile.defaultAboutMe', { 0: ctx.db.guild.prefix }),
      married: user.isMarry,
      partnerName: `@${couple?.username}`,
      bgId: user.background,
      stickerId: user.sticker,
      favColor: user.profileColor,
      avatarUrl: guildMember?.guildAvatar ?? member.avatarURL,
      badges: arrayBadges
    }
    if (cache.check(member.id, cache, data)) {
      requestTokamak({
        action: 'renderProfile',
        profileStruct: data
      })
        .then((profile) => {
          Logger.debug(`profile (${member.id}) request took ${Date.now() - a}ms to receive.`)
          cache.setCache(member.id, cache, data, profile.buffer)
          ctx.send('', {
            file: {
              file: profile.buffer,
              name: 'profile.png'
            }
          })
        })
    } else {
      ctx.send('', {
        file: {
          file: cache.$cacheStore.get(member.id),
          name: 'profile.png'
        }
      })
    }
  }
}
