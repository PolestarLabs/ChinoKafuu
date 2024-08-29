import chalk from 'chalk'
import { isMainThread, workerData } from 'worker_threads'
chalk.level = 8

const loggerDeveloper = process.argv.find((arg) => arg === '--loggerDev') ?? null

export class Logger {
  static get processType() {
    return isMainThread
      ? chalk.bgBlue('LOG')
      : chalk.black.bold.bgYellow(`[${workerData?.name ?? 'THREADING UNKNOWN'}]`)
  }

  static generateLog(logType, message = '') {
    if (typeof message === 'string') {
      message = message.replace(/aW50ZXJhY3Rpb246.*?(?=\b)/, chalk.gray('[REDACTED:interactionToken]'))
    }
    if (loggerDeveloper !== null) {
      const regexJson = /^\s*[{[][\s\S]*[}\]]\s*$/

      if (regexJson.test(message)) {
        console.log(`${chalk.gray(this.#getTimestamp)} ${this.processType} ${logType.replace(/\[([A-Za-z]+)\]/g, '$1').toLocaleLowerCase().padEnd(10, ' ')} ― ${chalk.blueBright('JSON')}.${chalk.yellowBright('Object')}`, JSON.parse(message), '\n')
      } else {
        if (typeof message === 'string') {
          message = message
            .replace(/DiscordRESTError \[[0-9]+\]/, (str) => chalk.redBright(str))
            .replace(/\s([A-Za-z0-9_]+:.*)/g, (str) => {
              const [key, value] = str.split(':')
              return [chalk.greenBright(key), value].join(':')
            })
            .replace(/\sat\s[#A-Za-z.]+\s\(.*\)/g, (str) => chalk.gray(str))
        }
        console.log(`${chalk.gray(this.#getTimestamp)} ${this.processType} ${logType.replace(/\[([A-Za-z]+)\]/g, '$1').toLocaleLowerCase().padEnd(20, ' ')} ― ${message}`)
      }

      return
    }
    console.log(`${chalk.yellow(Date().toString())} ${this.processType} ${logType} ${message}`)
  }

  static get #getTimestamp() {
    const now = new Date()
    const trace = [
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-`,
      `${String(now.getDate()).padStart(2, '0')}T`,
      `${String(now.getHours()).padStart(2, '0')}:`,
      `${String(now.getMinutes()).padStart(2, '0')}:`,
      `${String(now.getSeconds()).padStart(2, '0')}.`,
      `${String(now.getMilliseconds()).padStart(3, '0')}Z`
    ]

    return trace.join('')
  }

  static debug(message) {
    if (process.env.PRODUCTION === 'true') return
    // chalk.rgb(80, 250, 159)('[DEBUG]')
    this.generateLog(chalk.bold.blueBright('[DEBUG]'), message)
  }

  static info(message) {
    this.generateLog(chalk.bold.blue('[INFO]').toString('utf-8'), message)
  }

  static warning(message) {
    this.generateLog(chalk.bold.yellow('[WARNING]').toString('utf-8'), message)
  }

  static error(message) {
    this.generateLog(chalk.bold.red('[ERROR]').toString('utf-8'), message)
  }

  static shardMessage(message) {
    if (process.env.PRODUCTION === 'true') return
    // chalk.rgb(49, 204, 201)
    this.generateLog(chalk.bold.bgMagentaBright('[SHARD MANAGER]'), message)
  }

  static fatalError(message) {
    this.generateLog(chalk.bold.bgRed('[FATAL ERROR]'), message)
    process.exit()
  }
}

export class LoggerLavalink extends Logger {
  static debug(message) {
    if (process.env.PRODUCTION === 'true') return
    // chalk.rgb(80, 250, 159)('[DEBUG]')
    this.generateLog(chalk.bold.yellowBright('[LAVALINK]') + ' ' + chalk.bold.blueBright('[DEBUG]'), message)
  }

  static info(message) {
    this.generateLog(chalk.bold.yellowBright('[LAVALINK]') + ' ' + chalk.bold.blue('[INFO]').toString('utf-8'), message)
  }

  static warning(message) {
    this.generateLog(chalk.bold.yellowBright('[LAVALINK]') + ' ' + chalk.bold.yellow('[WARNING]').toString('utf-8'), message)
  }

  static error(message) {
    this.generateLog(chalk.bold.yellowBright('[LAVALINK]') + ' ' + chalk.bold.red('[ERROR]').toString('utf-8'), message)
  }

}
