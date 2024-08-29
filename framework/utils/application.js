import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import { LoggerSystem } from '../logger/defineLogger.js'

const RESTART_APPLICATION = 5 * 1000
const START_APPLICATION = 600
const HOT_RELOAD = 500


const sleep = async (time) => new Promise((resolved) => setTimeout(resolved, time))
const notReturn = async () => new Promise((resolved) => resolved())
const cannotRunApplication = (node) => {
  if (node.settings.notRun !== undefined) {
    if (Array.isArray(node.settings.notRun)) {
      const run = node.settings.notRun[0]
      const reason = node.settings.notRun[1]
      const ignore = node.settings.notRun[2]

      if (ignore !== undefined && ignore) {
        return true
      }

      if (run === undefined && typeof run === 'number') {
        throw new Error('You didn\'t inform parameter in boolean about application status.')
      }

      if (reason === undefined && typeof run === 'string') {
        throw new Error('You need to enter a reason or you entered a parameter incorrectly.')
      }

      logger.error(`${node.getNameProject()} repository cannot be started for this reason: ${reason}`)

      return true
    } else {
      throw new Error('You entered the `notRun` field wrongly. Returns in Array. For example: [false, "REASON"]')
    }
  }
  return false
}
const logger = new LoggerSystem('utils.NodeApplication')


export class NodeApplication extends EventEmitter {
  constructor(node) {
    super()
    this.node = node
    this.process = null
    this.started = false
    this.tryRestart = 0
    this.forceRestart = false
    this.restarting = false
  }


  async start() {
    const status = cannotRunApplication(this.node)

    if (this.started || status) {
      return notReturn()
    }


    const applicationAsync = () => new Promise((resolved, rejects) => {
      let commandSelector = this.node.commandSelector.run

      if (process.argv.includes(['--dev'])) {
        commandSelector = this.node.commandSelector.dev
      }

      const app = () => {
        this.started = true
        this.restarting = false
        logger.log(`Initializing application from repository of ${this.node.getNameProject()}\n`)

        const application = spawn(
          commandSelector.commandArgs.name,
          commandSelector.commandArgs.args,
          {
            cwd: this.node.resolved,
            shell: true,
            stdio: 'inherit', // It's easier to develop having a little insight into package management.
            serialization: 'json',
          })


        this.process = application

        application.on('spawn', () => resolved())

        application.on('error', (error) => {
          logger.error(`Something went wrong with ${this.node.getNameProject()}: There was an error running this application: ${error}`)
          rejects(`Something went wrong with ${this.node.getNameProject()}: There was an error running this application: ${error}`)
        })


        application.on('exit', async () => {
          if (this.forceRestart) {
            logger.warn(`Restarting the repository application of ${this.node.getNameProject()}.`)
            logger.warn(`Starting project application ${this.node.getNameProject()} in 2 seconds`)
            await sleep(RESTART_APPLICATION)
            app()
            return
          }
          this.started = false

          logger.warn(`For some reason project application ${this.node.getNameProject()} terminated application process.`)
          if (this.tryRestart >= 3) {
            logger.error(`Application of repository ${this.node.getNameProject()} cannot be terminated because it has exceeded the limit. For security reasons, I suggest pressing CONTROL + C to end the framework or restart.`)
            return
          }
          this.tryRestart++
          this.restarting = true
          logger.warn(`Starting project application ${this.node.getNameProject()} again in 2 seconds`)
          await sleep(RESTART_APPLICATION)
          app()
        })
      }

      app()
    })


    return applicationAsync()
  }
  restart() {
    this.forceRestart = true
    this.process.kill()
  }
  kill() {
    this.process.kill()
  }
  listenerAll() {
    this.on('restartApplication', (...args) => this.restart(args))
    this.on('startApplication', (...args) => this.start(args))
    this.on('killApplication', (...args) => this.kill(args))
  }
}