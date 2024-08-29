import chalk from 'chalk'
import { exec } from 'child_process'
import { Logger } from '../../structures/util/Logger'
import loadSettings from '../loadSettings'

const profileConstants = {
  default: 1 << 1,
  modern: 1 << 2,
  profile_2: 1 << 3,
}

const backgroundConstants = {
  gochiusa_1: 1 << 1,
  gochiusa_2: 1 << 2,
  gochiusa_3: 1 << 3,
  gochiusa_4: 1 << 4,
  gochiusa_5: 1 << 5,
  mtchaRed: 1 << 6,
  noGameNoLife_1: 1 << 7,
  noGameNoLife_2: 1 << 8,
  nycSkyline: 1 << 9,
  showByRock_1: 1 << 10,
  showByRock_2: 1 << 11,
  showByRock_3: 1 << 12,
  showByRock_4: 1 << 13
}

const backgroundPriceTableConstants = {
  'gochiusa_1': 10000,
  'gochiusa_2': 10350,
  'gochiusa_3': 10300,
  'gochiusa_4': 12000,
  'gochiusa_5': 19000,
  'mtchaRed': 85000,
  'noGameNoLife_1': 102000,
  'noGameNoLife_2': 102500,
  'nycSkyline': 5590,
  'showByRock_1': 110000,
  'showByRock_2': 212000,
  'showByRock_3': 230000,
  'showByRock_4': 257000
}

const profilePriceTableConstants = {
  'default': 0,
  'modern': 115000,
  'profile_2': 280000,
  'cute_profile': 0,
  data: [0, 115000, 280000, 0]
}

const profileInfo = [
  {
    name: 'Default',
    _id: 'default',
    flag: 1 << 1,
    readyForSale: true,
    description: null,
    shortDescription: 'It\'s only the default profile.',
    price: 0,
    buttonId: 'default',
    disabled: true,
    isDefault: true,
  },
  {
    name: 'Notebook',
    _id: 'modern',
    flag: 1 << 2,
    readyForSale: true,
    description: null,
    shortDescription: 'I guess I will put a note on my notebook.',
    price: profilePriceTableConstants.data[1],
    buttonId: 'modern',
    disabled: false,
    isDefault: false
  },
  {
    name: 'Modern',
    _id: 'profile_2',
    flag: 1 << 3,
    readyForSale: true,
    description: null,
    shortDescription: 'The default profile, but more modern.',
    price: profilePriceTableConstants.data[2],
    buttonId: 'profile_2',
    disabled: false,
    isDefault: false
  },
  {
    name: 'Cute Profile',
    _id: 'cute_profile',
    flag: 1 << 4,
    readyForSale: false,
    description: null,
    shortDescription: 'This profile is not available yet, wait until the next update.',
    price: profilePriceTableConstants.data[3],
    buttonId: 'cute_profile',
    disabled: true,
    isDefault: false
  }
]

const applicationCommandOptionType = {
  subCommand: 1,
  subCommandGroup: 2,
  string: 3,
  integer: 4,
  boolean: 5,
  user: 6,
  channel: 7,
  role: 8,
  mentionable: 9,
  number: 10
}

const applicationCommandPermissionType = {
  role: 1,
  user: 2
}

const typeCommand = {
  slashCommand: 1,
  userCommand: 2,
  messageCommands: 3,
  autoCompete: 4
}

const componentTypes = {
  actionRow: 1,
  button: 2,
  selectMenu: 3
}

const buttonStyle = {
  primary: 1,
  secondary: 2,
  success: 3,
  danger: 4,
  link: 5
}

const Flags_Guild = {
  GUILD_TESTER: 1 << 0,
  PREMIUM: 1 << 1,
  COMMAND_ACCESS_TESTER: 1 << 2,
  PARTNER: 1 << 3,
  BLACKLIST: 1 << 4,
  VERIFIED: 1 << 5,

  // Tool for dev
  NO_COOLDOWN: 1 << 6,
}

const Flags_Users = {
  DEVELOPER: 1 << 0,
  BUG_HUNTER: 1 << 1,
  BUG_HUNTER_EXTREME: 1 << 2,
  VOTE_ACTIVE: 1 << 4,
  TRANSLATOR: 1 << 5,
  VERIFIED: 1 << 6,
  ACCESS_TO_BUY_PROFILE: 1 << 7,
  ACCESS_TO_DECORATE_PROFILE: 1 << 8,
  BOOST_ACTIVE: 1 << 9,
  SUPPORT: 1 << 14,
  // Tool for dev
  NO_COOLDOWN: 1 << 10,

  // STORE
  BLACKLIST_STORE: 1 << 11,
  STORE_ACCESS: 1 << 3,
  ADMIN_STORE: 1 << 12,
  PARTNER_STORE: 1 << 13
}

const Flags_Command = {
  BROKEN_COMMAND: 1 << 0,
  BROKEN_COMMAND_NOTICED: 1 << 1,
  BUG_TRACKING: 1 << 2,
  DISABLED: 1 << 3,
  COMMAND_TESTER: 1 << 4
}

const BUILD_INFO = {
  version: globalThis.versionProject,
  build: Buffer.from(`${globalThis.versionProject}`).toString('base64'),
  commit_log: async () => {

    let kill_process = false
    if (process.env.BUILD_SHOW === undefined) {
      return
    }
    if (process.env.BUILD_SHOW === 'false') {
      return
    }
    const e = await exec('git show', async (error, stdout) => {
      if (error) {
        kill_process = true
        await e.kill() // Kill process.
        return
      }
      const get_first_line = stdout.split('\n')[0]
      const get_message = stdout.split('\n')[4].replace(/ +([^A-Za-z0-9_])/g, '')
      Logger.info(`${chalk.green(`[BUILD COMMIT]`)} ${get_first_line.replace(/commit( +)|(^[A-Za-z0-9_]+)|( +\(.*\))/g, '')} (${globalThis.versionProject}) / ${get_message}`)
      Logger.debug(`${chalk.magenta('[BUILD PRODUCTION]')} ${process.env.PRODUCTION ? `${chalk.greenBright(`Channel: Beta`)}` : `${chalk.blueBright(`Channel: Production`)}`}`)
      await e.kill()
      kill_process = true
    })
    if (!kill_process) {
      await e.kill()
    }
  },
  getCommit: async () => {
    const { version } = loadSettings()

    const data = {
      commit: null,
      message: null,
      version: version
    }

    const e = await exec('git show', async (error, stdout) => {
      if (error) {
        await e.kill()
        return
      }

      const get_first_line = stdout.split('\n')[0]
      const get_message = stdout.split('\n')[4].replace(/ +([^A-Za-z0-9_])/g, '')
      data.commit = get_first_line.replace(/commit( +)|(^[A-Za-z0-9_]+)|( +\(.*\))/g, '')
      data.message = get_message
      await e.kill()
      if (data.commit !== null && data.message !== null) {
        Logger.info(`${chalk.green(`[BUILD COMMIT] ${version}@${data.commit} ->`)} ${data.message}`)
        Logger.debug(`${chalk.magenta('[BUILD PRODUCTION]')} ${process.env.PRODUCTION ? `${chalk.greenBright(`Channel: Beta`)}` : `${chalk.blueBright(`Channel: Production`)}`}`)
      }
    })

    return data
  }
}

const Constants = {
  profileConstants,
  backgroundConstants,
  backgroundPriceTableConstants,
  profilePriceTableConstants,
  profileInfo,
  applicationCommandOptionType,
  applicationCommandPermissionType,
  typeCommand,
  componentTypes,
  buttonStyle,
  Flags_Command,
  Flags_Users,
  Flags_Guild,
  BUILD_INFO
}
export default Constants

export {
  profileConstants,
  backgroundConstants,
  backgroundPriceTableConstants,
  profilePriceTableConstants,
  profileInfo,
  applicationCommandOptionType,
  applicationCommandPermissionType,
  typeCommand,
  componentTypes,
  buttonStyle,
  Flags_Command,
  Flags_Users,
  Flags_Guild,
  BUILD_INFO
}

