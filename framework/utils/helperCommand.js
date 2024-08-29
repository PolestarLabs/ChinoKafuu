import chalk from 'chalk'
import { loadListCommands } from './loadCommands.js'

const searchCommand = (commandName = '') => {
  const timeStart = Date.now()
  const filter = loadListCommands.filter((i) => i.name.toLocaleLowerCase().replace(/-|--/g, '').includes(commandName.toLocaleLowerCase()))
  const template = chalk.blackBright(`Similar name found(${filter.length}): ${filter.map((e) => e.name).join(', ')}`)
  const timeEnd = chalk.magentaBright(`   ${(Date.now() + 0.2 - (timeStart + 0.1))}ms `) + '  -  '
  console.log(`\n\n🔎 | I googled similar names for you: ${chalk.yellowBright(commandName)}.\n${timeEnd + template}\n\n\n`)
  return {
    isValid: !(filter.length > 1 || filter.length <= 0),
    index: filter[0] ?? null
  }
}

export const CommandHeader = (options) => {
  console.log(`\n\n${chalk.yellowBright(`${options?.title != undefined ? options?.title : 'ChinoKafuu - Framework'}`)}`)
  console.log(chalk.blackBright(`${options?.description != undefined ? options?.description : 'A powerful framework running repositories and helping with ChinoKafuu production development.'}`))
}


export const CommandList = (commands = []) => {
  const commandsText = []

  for (const command of commands) {
    commandsText.push({
      packageManager: command.name.search(/bun|yarn|js|npm|node|deno/g),
      text: `\n${command.name.search(/bun|yarn|js|npm|node/g) ? ' ○' : chalk.bold.yellowBright('~$')}   {commandName} =   {description}\n`,
      ...command
    })
  }
  let space = 0
  const text = commandsText
    .sort((a, b) => b.name.length - a.name.length)
    .sort((a, b) => b.packageManager - a.packageManager)
    .map((i) => {
      if (i.name.length >= space) {
        space = i.name.length
      }

      return i.text
        .replace(/\{commandName\}/g, () => chalk.greenBright(i.name).padEnd(space + 12, ' '))
        .replace(/bun|deno|js|yarn/g, (str) => {
          if (str.startsWith('bun')) {
            return chalk.whiteBright(str)
          } else if (str.startsWith('deno')) {
            return chalk.blueBright(str)
          } else if (str.startsWith('js')) {
            return chalk.yellow(str)
          } else if (str.startsWith('yarn')) {
            return chalk.magentaBright(str)
          }

          return str
        })
        .replace(/\{description\}/g, () => chalk.cyanBright(i.description))
    })
    .join('   ')
  console.log(`\n\n\nSome cool commands available to develop ${chalk.whiteBright(`(For help you can use ${chalk.magentaBright('yarn framework <command or arg>')})`)}:\n\n${text}`)

  console.log(`\n\n\n\n\n\n\n\n\n${chalk.greenBright('If you find a bug you can open an issue on Github:')}\nhttps://github.com/RabbitHouseCorp/ChinoKafuu/issues/new/choose\n\n\n\n\n\n\n`)

}

const getCommandKey = () => {
  let isCommandHelper = false
  let getCommand = null

  for (const arg of process.argv) {
    if (arg.startsWith('-h')) {
      isCommandHelper = true
    } else if (isCommandHelper) {
      getCommand = arg
      break
    }
  }

  return { isCommandHelper, getCommand }
}


const CommandInfo = () => {

}


export const executeCommand = () => {
  const key = getCommandKey()

  if (!key.isCommandHelper) return false
  if (key.getCommand === null) {
    [CommandHeader(), CommandList(loadListCommands)]
    return true
  } else {
    [
      CommandHeader({
        title: 'CommandHelper',
        description: 'Get details about the command. You provided the parameter.'
      }),
      CommandInfo(searchCommand(key.getCommand.replace(/--/g, '')))
    ]
    return true
  }
}



