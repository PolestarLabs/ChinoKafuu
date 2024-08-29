import chalk from 'chalk'
export const UIKit = {
  ROUNDED_TOP_LEFT: '╭',
  ROUNDED_TOP_RIGHT: '╮',
  HORIZONTAL: '─',
  BOTTOM_RIGHT: '┘',
  BOTTOM_LEFT: '└',
  BAR: '│'
}

let warnMessage = 'The tool is currently not complete. This can take a while to complete. Until you develop another data structure.'


const resizeText = (text = '') => {
  return text.length >= process.stdout.columns - 15 ? text.substring(0, process.stdout.columns - 14) + '...' : text
}


export const Projects = (options = {
  disableTable: false,
  data: []
}) => {
  const space = '       '.substring(0, process.stdout.columns - 14)
  const tableSizeText = [0, 0, 0, 0, 0]


  const table = []

  for (const i of options.data) {
    const usage = i.d.stateProcess.d.memoryUsage
    const memoryUsage = (usage.heapUsed / usage.heapTotal) * 100
    const cpuUsage = i.d.stateProcess.d.cpuUsage
    const calcCpu = cpuUsage.system

    table.push({ message: `${chalk.yellowBright(0)}`.padStart(14, ' ') }) // Process ID: soon
    table.push({ message: `${chalk.blueBright(i.d.projectName)}` })
    table.push({ message: `${chalk.greenBright(i.d.statusConnection ? 'CONNECTED' : 'DISCONNECTED')}` }) // Then I will develop a way to resolve process status.
    table.push({ message: chalk.redBright(`${(usage.heapUsed / (1024 ** 2)).toFixed(2)}MB/${(usage.heapTotal / (1024 ** 2)).toFixed(2)}MB (${memoryUsage.toFixed(2)}%)`) })
    table.push({ message: chalk.yellowBright(`${(calcCpu).toFixed(1)}%`) })

  }



  let position = -1

  const changeSpace = (data) => {
    for (const i of data) {
      if (i.message.length >= tableSizeText[position]) {
        tableSizeText[position] = i.message.length - 10
      }
    }
  }

  for (const i of table) {
    position++

    if (Array.isArray(i)) {
      changeSpace(i)
    } else {
      if (i.message.length >= tableSizeText[position]) {
        tableSizeText[position] = i.message.length - 10
      }
    }
  }
  const removeLetter = 60
  const max = 1
  const tableName = [
    'PID'
      .padEnd(tableSizeText[0], space)
      .substring(0, Math.max(process.stdout.columns - removeLetter, max)),
    'Name'
      .padEnd(tableSizeText[1], space)
      .substring(0, Math.max(process.stdout.columns - removeLetter, max)),
    'Status'
      .padEnd(tableSizeText[2], space)
      .substring(0, Math.max(process.stdout.columns - removeLetter, max)),
    'Memory'
      .padEnd(tableSizeText[3], space)
      .substring(0, Math.max(process.stdout.columns - removeLetter, max)),
    'CPU'
      .padEnd(tableSizeText[4], space)
      .substring(0, Math.max(process.stdout.columns - removeLetter, max))
  ]

  const tab = !options.disableTable ? `${UIKit.BAR}${tableName.join(space)}`.padEnd(process.stdout.columns - 7, ' ') + UIKit.BAR : ''
  const tabItems = `${UIKit.BAR}${table.map((i) => i.message).join(space)}`.padEnd(process.stdout.columns + 43, ' ') + UIKit.BAR

  return [tab, tabItems].join('\n')
}

export const Window = (title = '', state) => {
  // process.stdout.columns
  let leftPadding = Math.floor((process.stdout.columns - title.length) / 1)
  let rightPadding = (process.stdout.columns - title.length) / Math.floor(1.38)
  let size = 0
  if (title.length <= 0) {
    leftPadding = process.stdout.columns
    size = process.stdout.columns - 10
    rightPadding = 0
  } else {
    size = rightPadding
  }
  const _titleWindowEnd = ''
    .padStart(leftPadding - 10, UIKit.HORIZONTAL)
    .padEnd(rightPadding, UIKit.HORIZONTAL)
  const _title = `${title.length <= 1 ? '' : resizeText(`[ ${title} ]`)}`
    .padStart(leftPadding, UIKit.HORIZONTAL)
    .padEnd(10, UIKit.HORIZONTAL)



  const windowTitle = `\n\n\n${UIKit.ROUNDED_TOP_LEFT}${_title}${UIKit.ROUNDED_TOP_RIGHT}`
  const windowEnd = `${UIKit.BOTTOM_LEFT}${_titleWindowEnd}${UIKit.BOTTOM_RIGHT}\n\n\n`


  return [
    chalk.yellowBright(`| WARN:   ${warnMessage}`),
    windowTitle,
    Projects({
      disableTable: false,
      data: state
    }),
    windowEnd
  ].join('\n')

}