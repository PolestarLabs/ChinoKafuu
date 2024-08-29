''
import WebSocket from 'ws'
import { watchConnectComponent, watchfailToConnectComponent } from './animation/loadingServer.js'
import { Window } from './ui.js'
const loadingFrame = ['◯', '◯', '◯']
let control = {
  position: 0,
  direction: 0
}
let last = -2
var current = -1
let state = []
let component = null
let renderNew = ''
let renderCurrent = ''
let currentWidth = 0
let killInterval = null
const selectorKey = (key) => {
  const list = [
    {
      'name': 'right',
      'command': '\x1B[C'
    },
    {
      'name': 'left',
      'command': '\x1B[D'
    },
    {
      'name': 'up',
      'command': '\x1B[A'
    },
    {
      'name': 'down',
      'command': '\x1B[B'
    },
    {
      'name': 'pageup',
      'command': '\x1B[5~'
    },
    {
      'name': 'pagedown',
      'command': '\x1B[6~'
    },
    {
      'name': 'home',
      'command': '\x1B[1~'
    },
    {
      'name': 'end',
      'command': '\x1B[4~'
    },
    {
      'name': 'insert',
      'command': '\x1B[2~'
    },
    {
      'name': 'delete',
      'command': '\x1B[3~'
    },
    {
      'name': 'ctrl+a',
      'command': '\x01'
    },
    {
      'name': 'ctrl+q',
      'command': '\x11'
    },
    {
      'name': 'ctrl+w',
      'command': '\x17'
    },
    {
      'name': 'ctrl+r',
      'command': '\x12'
    },
  ]
  const k = list.filter((i) => i.command === key)[0]

  return k === undefined ? {
    'name': key,
    'command': null
  } : k
}

const renderComponent = () => {
  currentWidth = process.stdout.columns
  killInterval = setInterval(() => {
    renderNew = [Window('Projects', state)].join('\n')
    if (renderNew === renderCurrent) return
    const calcLine = renderNew.split('\n').length
    const line = calcLine <= 0 ? '\n'.repeat(calcLine) : ''
    if (process.stdout.columns <= currentWidth) {
      currentWidth = process.stdout.columns
    }

    process.stdout.write(line + `\u001B[E\x1Bc\u001B[?25l`)

    renderCurrent = renderNew
    process.stdout.write(`\r${renderCurrent}`)
  })
}

const wsClient = () => {
  const ws = new WebSocket('ws://127.0.0.1:24607', {
    headers: {
      'watch': 'true'
    }
  })

  return ws
}

const watchComponentHeader = () => {
  console.log(watchComponent)
}


const watchComponent = () => {
  const stdin = process.openStdin()
  renderComponent()


  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf-8')

  stdin.on('data', (key) => {
    if (key === '\u0003') {
      process.stdout.write(`\x1Bc`)
      process.exit()
    }

    const keySelected = selectorKey(key)

    if (keySelected.name === 'up') {
      control.position++
    }

    if (keySelected.name === 'down') {
      control.position--
    }
  })
}



export const watchStart = () => {
  if (process.argv.includes('watchMode')) {
    component = watchConnectComponent()
    const start = () => {
      const client = wsClient()
      client.on('open', () => {
        clearTimeout(component)
        component = watchComponent()
      })

      client.on('message', (data) => {
        const message = JSON.parse(data)
        state = message
      })
      client.on('close', () => {
        process.stdout.write(`\x1Bc`)
        console.log('Disconnected!')
        clearInterval(killInterval)
        const stdin = process.openStdin()

        stdin.setRawMode(false)
      })
      client.on('error', () => {
        clearTimeout(component)
        component = watchfailToConnectComponent()
      })
    }
    setTimeout(start, 1 * 1000)

    return true
  }

  return false
}