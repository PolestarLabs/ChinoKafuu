import chalk from 'chalk'



class LoggerSystem {
  constructor(name) {
    this.name = name
  }

  get #getTimestamp() {
    const now = new Date()

    // Create a nice time format for framework.
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

  get #template() {
    return chalk.blackBright(`[${this.name}]`) // `${chalk.gray(this.#getTimestamp)}`
  }

  #colorMessage(message) {
    return message
      .replace(/\!\$".*"/g, (text) => chalk.yellowBright(text.replace(/^\!\$"|"$/g, '')))
      .replace(/\$".*"/g, (text) => chalk.redBright(text.replace(/^\$"|"$/g, '')))
      .replace(/Success|Connected|connected|successfully|Successfully/g, (text) => chalk.greenBright(text))
      .replace(/Error|error|ERROR|fail/g, (text) => chalk.redBright(text))
      .replace(/developer|debug/g, (text) => chalk.magentaBright(text))
      .replace(/(@(\\|\/)[A-Za-z0-9]+|\/[A-Za-z0-9]+)\.[A-Za-z0-9]+|(\/[A-Za-z0-9]+|\/[A-Za-z0-9]+)/g, (text) => chalk.blue(text))
      .replace(/^[a-zA-Z0-9]{24}$/g, '[REDACTED]')
      .replace(/@[A-Za-z0-9]+/g, (text) => chalk.yellowBright(text))
      .replace(/(\*\*([^*]+)\*\*)/g, (str) => chalk.bold.whiteBright(str.replace(/(^\*\*)|(\*\*$)/g, '')))
      .replace(/(\*([^*]+)\*)/g, (str) => chalk.bold.dim(str.replace(/(^\*)|(\*$)/g, '')))
      .replace(/(__([^*]+)__)/g, (str) => chalk.underline.whiteBright(str.replace(/(^__)|(__$)/g, '')))
      .replace(/([0-9]+|\d+(\.\d+)?)kB|([0-9]+|\d+(\.\d+)?) kB/g, (str) => chalk.greenBright(str))
      .replace(/([0-9]+|\d+(\.\d+)?)Mb|([0-9]+|\d+(\.\d+)?) Mb/g, (str) => chalk.yellowBright(str))
      .replace(/([0-9]+|\d+(\.\d+)?)Gb|([0-9]+|\d+(\.\d+)?) Gb/g, (str) => chalk.redBright(str))
      .replace(/(^removed|remove^) Gb/g, (str) => chalk.redBright(str))
  }



  skipLine() {
    console.log('\n\n')
  }

  log(message) {
    if (process.argv.includes('--silent')) return
    this.generateLog(chalk.greenBright(`LOG`), typeof message === 'object' || Array.isArray(message) ? message : this.#colorMessage(message))
  }

  warn(message) {
    this.generateLog(chalk.yellowBright('[WARN]'), typeof message === 'object' || Array.isArray(message) ? message : this.#colorMessage(message))
  }

  error(message) {
    this.generateLog(chalk.redBright('[ERROR]'), this.#colorMessage(message))
  }

  debug(message) {
    if (process.argv.includes('--silent')) return
    if (process.argv.includes('--debug')) {
      this.generateLog(chalk.blueBright('[DEBUG]'), typeof message === 'object' || Array.isArray(message) ? message : this.#colorMessage(message))
    }
  }

  trace(message) {
    if (process.argv.includes('--silent')) return
    if (process.argv.includes('--trace')) {
      this.generateLog(chalk.white('[TRACE]'), typeof message === 'object' || Array.isArray(message) ? message : this.#colorMessage(message))
    }
  }

  generateLog(logType, message = '') {
    if (typeof message === 'string') {
      message = message.replace(/aW50ZXJhY3Rpb246.*?(?=\b)/, chalk.gray('[REDACTED:interactionToken]'))
    }
    const regexJson = /^\s*[{[][\s\S]*[}\]]\s*$/
    if (typeof message === 'object' || Array.isArray(message)) {
      console.log(`${chalk.magenta('[framework]')} ${chalk.gray(this.#getTimestamp)} ${typeof this.name === 'string' ? chalk.dim(this.name + '.') : ''}${logType.replace(/\[([A-Za-z]+)\]/g, '$1').toLocaleLowerCase().padEnd(10, ' ')} ― ${chalk.blueBright('JSON')}.${chalk.yellowBright('Object')}`,message, '\n')
    } else if (regexJson.test(message)) {
      console.log(`${chalk.magenta('[framework]')} ${chalk.gray(this.#getTimestamp)} ${typeof this.name === 'string' ? chalk.dim(this.name + '.') : ''}${logType.replace(/\[([A-Za-z]+)\]/g, '$1').toLocaleLowerCase().padEnd(10, ' ')} ― ${chalk.blueBright('JSON')}.${chalk.yellowBright('Object')}`, JSON.parse(message), '\n')
    } else {
      message = message
        .replace(/DiscordRESTError \[[0-9]+\]/, (str) => chalk.redBright(str))
        .replace(/\s([A-Za-z0-9_]+:.*)/g, (str) => {
          const [key, value] = str.split(':')
          return [chalk.greenBright(key), value].join(':')
        })
        .replace(/\sat\s[#A-Za-z.]+\s\(.*\)/g, (str) => chalk.gray(str))
      console.log(`${chalk.magenta('[framework]')} ${chalk.gray(this.#getTimestamp)} ${typeof this.name === 'string' ? chalk.dim(this.name + '.') : ''}${logType.replace(/\[([A-Za-z]+)\]/g, '$1').toLocaleLowerCase().padEnd(20, ' ')}― ${message}`)
    }
  }
}

export { LoggerSystem }

