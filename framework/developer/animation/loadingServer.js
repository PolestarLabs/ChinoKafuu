import chalk from 'chalk'
let loadingFrame = ['◯', '◯', '◯']
let last = -2
let current = -1
let skip = 0

export const watchConnectComponent = () => {
  process.stdout.write(`\x1Bc`)

  const changeAnimation = () => {
    const frame = loadingFrame
      .join(' ')
      .replace(/◯/g, (str) => chalk.bold.yellowBright('◯'))
      .replace(/⬤/g, (str) => chalk.greenBright('⬤'))
    current++
    last++


    if (!(current >= loadingFrame.length)) {
      loadingFrame[current] = '⬤'
    } else {
      current = -1
    }

    if (!(last >= loadingFrame.length)) {
      loadingFrame[last] = '◯'
    } else {
      last = -1
    }


    loadingFrame.length = 3
    return ` ${frame} Connecting in ServerDeveloper...`
  }
  return setInterval(() => {
    process.stdout.write("\r" + changeAnimation())
  }, 200)
}



export const watchfailToConnectComponent = () => {

  process.stdout.write(`\x1Bc`)
  process.openStdin()
  const changeAnimation = () => {
    const frame = loadingFrame
      .join(' ')
      .replace(/◯/g, (str) => chalk.bold.redBright('◯'))
      .replace(/⬤/g, (str) => chalk.redBright('⬤'))
    const __loadingFrame = ['◯', '◯', '◯']
    const _loadingFrame = ['⬤', '⬤', '⬤']

    skip++
    skip &= 1

    if (skip === 0) {
      loadingFrame = __loadingFrame
    } else {
      loadingFrame = _loadingFrame
    }

    loadingFrame.length = 3
    return ` ${frame} Unable to connect to the server!`
  }
  return setInterval(() => {
    process.stdout.write("\r" + changeAnimation())
  }, 800)
}
