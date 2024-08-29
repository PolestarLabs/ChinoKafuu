import { EventEmitter } from 'events'
import { WebSocketServer } from 'ws'
import { LoggerSystem } from '../logger/defineLogger.js'

import { ProcessModel } from './model/ProcessModel.js'
const isDeveloperMode = () => process.argv.includes('--dev')
const enableServer = () => process.argv.includes('--watch-server')
const logger = new LoggerSystem('WebsocketServerDeveloper')
const nameCute = () => {
  const name = ['Cocoa', 'Chino', 'Rize', 'Sharo', 'Tippy']
  return name[Math.floor(Math.random() * name.length)]
}

const ClientWebsocket = (options = {
  type: 'client',
  ip: '',
  port: '',
  latency: 0,
  process: null,
  trackProject: null,
  terminal: null,
  statusConnection: false,
  request: null,
  socket: null,
  dataOld: {},
}) => ({
  type: 'client',
  name: nameCute(),
  ip: '',
  port: '',
  latency: '',
  process: '',
  trackProject: '',
  statusConnection: true,
  terminal: '',
  request: null,
  dataOld: {},
  ...options
})

const randomID = () => Math.floor(Math.random() * 1000000000000)

export class WebSocketServerDeveloper extends EventEmitter {
  constructor(nodes) {
    super()
    if (!isDeveloperMode()) return
    this.nodes = nodes
    this.clients = new Array()

    this.ws = new WebSocketServer({
      port: 24607,
      perMessageDeflate: {
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    })

    this.ws.on('error', (err) => {
      logger.error(err)
    })
    this.ws.on('connection', (socket, request) => {
      const family = (request.socket.remoteAddress !== '::1' && request.socket.remoteAddress !== '0.0.0.0')
      const family2 = (request.socket.remoteAddress !== '::ffff:127.0.0.1' && request.socket.remoteAddress !== '127.0.0.1')
      if (!family2 && !family) {
        socket.close()
        return
      }

      const headerProjectName = request.headers['projectname']
      const client = ClientWebsocket({
        idClient: randomID(),
        projectName: headerProjectName === undefined ? randomID() : headerProjectName,
        type: request.headers['watch'] === undefined ? 'client' : 'watch',
        ip: request.socket.remoteAddress,
        port: request.socket.remotePort,
        latency: -1,
        process: process.execPath,
        trackProject: '',
        statusConnection: true,
        terminal: null,
        request,
        socket
      })

      if (client.type === 'client') {
        logger.log(`${client.name} connected in the communication center of develop. (${client.ip + `:${client.port}`})`)
        this.deleteWatch(client)
        this.addClient(client, socket, request)
      } else {
        this.addWatchClient(client, socket, request)
      }

      socket.on('close', () => this.clientDisconnect(client))
    })
    this.ws.on('listening', () => logger.debug(`Server listening port on 24607`))
    this.on('message', (data) => {
      this.sendMessageForWatchers(data)
    })
  }

  clientDisconnect(client) {
    if (client === 'watch') return

    client.statusConnection = false
    const clientWatcher = this.clients.filter((i) => i.type === 'watch')
    const clients = this.clients.filter((i) => i.type === 'client')
    const getInformations = clients.map((i) => {
      const stateProcess = i.project?.clientState?.stateProcess !== undefined ? i.project.clientState.stateProcess : null
      const commandStats = i.project?.clientState?.commandStats !== undefined ? i.project?.clientState?.commandStats : null
      const listeners = i.project.clientState.listeners !== undefined ? i.project.clientState.listeners : null
      const stateGlobal = i.project.clientState.stateGlobal !== undefined ? i.project.clientState.stateGlobal : null
      return {
        d: {
          projectName: i.projectName,
          statusConnection: i.statusConnection,
          projectName: i.project.getNameProject(),
          stateProcess,
          commandStats,
          listeners,
          stateGlobal
        }
      }
    })

    for (const watcher of clientWatcher) {
      watcher.socket.send(JSON.stringify(getInformations))
    }
  }

  addWatchClient(client, socket, request) {
    this.clients.push(client)
  }


  deleteWatch(client) {

    const clientOld = this.clients.filter((i) => i.projectName === client.projectName && i.statusConnection === false)
    if (clientOld !== undefined) {
      const index = this.clients.findIndex((i) => i.projectName === client.projectName && i.statusConnection === false)

      this.clients.splice(index, 1)
    }
  }

  sendMessageForWatchers() {
    const clientWatcher = this.clients.filter((i) => i.type === 'watch')
    const clients = this.clients.filter((i) => i.type === 'client')

    const getInformations = clients.map((i) => {
      const stateProcess = i.project?.clientState?.stateProcess !== undefined ? i.project.clientState.stateProcess : null
      const commandStats = i.project?.clientState?.commandStats !== undefined ? i.project.clientState.commandStats : null
      const listeners = i.project?.clientState?.listeners !== undefined ? i.project.clientState.listeners : null
      const stateGlobal = i.project?.clientState?.stateGlobal !== undefined ? i.project.clientState.stateGlobal : null
      return {
        d: {
          projectName: i.projectName,
          statusConnection: i.statusConnection,
          stateProcess,
          commandStats,
          listeners,
          stateGlobal
        }
      }
    })
    for (const client of clientWatcher) {
      client.socket.send(JSON.stringify(getInformations))
    }
  }

  addClient(client, socket, request) {

    this.clients.push(client)

    socket.on('message', (message) => {
      const json = JSON.parse(message)
      const parseModel = ProcessModel(json)

      if (parseModel.t === 'process') {
        client.dataOld = parseModel
        try {
          client.projectName = parseModel.d.projectName
          this.nodes.searchNode(parseModel.d.projectName).clientState = {
            client,
            stateProcess: parseModel
          }
          client.project = this.nodes.searchNode(parseModel.d.projectName)
          this.emit('message', parseModel)

        } catch (e) {
          console.log(e)
        }
      } else if (parseModel.t === 'commandStats') {
        this.nodes.searchNode(parseModel.d.projectName).clientState.commandStats = json.d
      } else if (parseModel.t === 'listenerStats') {
        this.nodes.searchNode(parseModel.d.projectName).clientState.listeners = json.d
      } else if (parseModel.t === 'stateGlobal') {
        this.nodes.searchNode(parseModel.d.projectName).clientState.stateGlobal = json.d
      }
    })
  }
}