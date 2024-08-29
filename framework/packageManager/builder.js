import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import { readFileSync } from 'fs'
import path from 'path'
import { ProcessModel } from '../developer/model/ProcessModel.js'
import { LoggerSystem } from '../logger/defineLogger.js'
import { ModelNodeBuilder } from '../model/NodeBuilder.js'
import { ModelNodeResolver } from '../model/noderesolver.js'
import { NodeResolution } from '../NodeResolution.js'
import { NodeTest } from '../tester/NodeTest.js'
import { NodeApplication } from '../utils/application.js'

import { loadConfiguration } from '../utils/loadSettings.js'
import { compileModeDeveloper, compileModeProduction } from '../utils/typescriptCompile.js'
import { selectPackageCommand } from './packageCommands.js'

const logger = new LoggerSystem('packageManager.builder')

const selectPackageManager = (projectName) => {
  let packageManager = null
  for (const argv of process.argv) {
    if (argv.startsWith('--packageManager')) {
      packageManager = argv.replace(/--packageManager=/, '')

      if (packageManager.match(/yarn|yarnpkg|pnpm|pnpx|bun|bunPackageManager|npm|npx/g) === null) {
        logger.error(`The $""${packageManager}"" is not supported or does not exist. Currently works with Yarn or NPM or Bun or PNPM OR PNPX\n\n`)
        throw Error(`The ${packageManager} is not supported or does not exist. Currently works with Yarn or NPM or Bun or PNPM OR PNPX`)
      }

      logger.warn(`This project ${projectName} is being forced because you are using custom Package Manager which is !$""${packageManager}""`)
      break
    }
  }

  return packageManager
}


const selectRepository = () => {
  let repository = []
  let start = false
  for (const argv of process.argv) {
    if (argv.startsWith('--repository') && argv.startsWith('--repository=')) {
      logger.debug('Enlisting list of commands:')
      // yarn installPackage --repository @chinokafuu/revolt @chinokafuu/discord
      repository.push(argv)

      start = true
    } else if (argv.startsWith('--')) {
      start = false
    }
  }

  return {
    repository
  }
}

/**
 * This class is a core node for controlling repository.
 */
export class Node extends EventEmitter {
  constructor(resolved = '/', options = {
    repositoryCheck: false,
    requiredInstallationOfPackages: false,
    isTest: false
  }) {
    super()
    this.secretName = null
    this.clientState = {
      client: null,
      stateProcess: ProcessModel({}),
      commandStats: {
        executed: [],
        errors: [],
      },
      listeners: {
        executed: [],
        errors: [],
      },
      stateGlobal: {
        errors: [],
        cacheLoaded: []
      }
    }
    this.packageProject = {}
    this.resolved = resolved
    this.isProject = false
    this.options = options
    this.settings = ModelNodeBuilder()
    this.packageManager = 'unknown'
    this.commandSelector = null
    this.loaded = false
    this.resolution = new NodeResolution(this)
    this.application = new NodeApplication(this)
    this.tester = new NodeTest(this)
    this.#loadPackage()
    this.loadSettings()
    this.#check()
  }

  async test() {
    return this.tester.runTest()
  }

  #loadPackage() {
    const packageProject = readFileSync(path.resolve(this.resolved + '/package.json'))
    if (!this.options.isTest) {
      logger.debug('@/package.json has been loaded successfully!')
    }

    this.packageProject = JSON.parse(packageProject)
    const customPackageManager = selectPackageManager(this.packageProject.name)
    if (customPackageManager === null) {
      this.packageManager = this.packageProject.packageManager ?? 'npm'
    } else {
      this.packageManager = customPackageManager
    }

    this.commandSelector = selectPackageCommand(this.packageManager)
  }

  #loadName() {
    this.secretName = this.packageProject.name
    logger.debug(`Project has been renamed to ${this.packageProject.name}`)
  }

  #check() {
    if (this.options.requiredInstallationOfPackages) {
      if (!this.options.isTest) {
        logger.warn('This repository requires installation!')
      }
    }
    this.#loadName()
  }

  /**
   * After recognizing the nodes of the monorepo structure, start downloading the packages.
   */
  loadSettings() {
    this.settings = {}
    if (!this.options.isTest) {
      logger.debug('No configuration loaded, preparing to load one.')
    }
    if (!this.loaded) {
      const settings = loadConfiguration(path.resolve(this.resolved + '/settingsFramework.json'))

      if (ModelNodeResolver(settings, path.resolve(this.resolved + '/settingsFramework.json'))) {
        if (!this.options.isTest) {
          logger.debug(`Configuration uploaded successfully! @/settingsFrameworkGlobal.json`)
        }

        this.emit('settings', (true, this.settings, this))
        this.loaded = true
      }

      this.settings = settings
    }

    this.emit('settings', (false, this.settings, this))
  }


  isThisRepositoryThatInstallsPackages() {
    return selectRepository().repository.includes(this.getNameProject())
  }

  /**
   * ### Install the required packages.
   * 
   * here are some things that the Package Manager itself can handle certain packages that
   *  can give problems finding files or packages. 
   * They automatically perform compilation or run scripts that are configured 
   * in these third-party packages.
   * 
   * 
   * 
   * Note about working with package managers is that if you automatically specify the code
   *  it will read package.json and find the packageManager
   *  field which will make it enter the correct command to run package manager. 
   * But always make sure everything is installed.
   * 
   * 
   * 
   * 
   * The code won't install the Package Manager for you, 
   * it will basically return an error saying the command doesn't exist 
   * or need to configure Development Environment.
   */
  async install() {
    return new Promise((resolve, rejects) => {
      const command = spawn(
        this.commandSelector.install.commandArgs.name,
        this.commandSelector.install.commandArgs.args,
        {
          cwd: path.resolve(this.resolved),
          shell: true,
          stdio: 'inherit', // It's easier to develop having a little insight into package management.
          serialization: 'json',
        })

      command.on('error', (error) => {
        logger.error(`:install().command<error>: ${error}`)
        rejects(error)
      })

      command.on('exit', (code) => {
        if (code != 0) {
          logger.error(`:install().command<exit>: Package Manager closed unexpectedly or was forced to close.`)
          rejects(null)
        }
      })

      command.on('close', (code) => {
        resolve()
      })
    })
  }



  async installPackage() {
    return new Promise((resolve, rejects) => {
      if (this.isThisRepositoryThatInstallsPackages()) {
        return resolve()
      }
      const argv = process.argv
      const packages = []
      let collectPackage = false

      for (const arg of argv) {
        let ignoreThat = false
        if (arg.includes('--installPackage')) {
          ignoreThat = true
          collectPackage = true
          // yarn installPackage --installPackage package1 package2 (--no-ts) = Break loop
        } else if (arg.includes('--')) {
          collectPackage = false
        }

        if (collectPackage && !ignoreThat) {
          packages.push(arg)
        }
      }



      let command

      if (packages.length <= 0) {
        this.commandSelector.add.commandArgs.args.push(...packages) // Add packages or args :^) 
        command = spawn(
          this.commandSelector.install.commandArgs.name,
          this.commandSelector.install.commandArgs.args,
          {
            cwd: path.resolve(this.resolved),
            shell: true,
            stdio: 'inherit', // It's easier to develop having a little insight into package management.
            serialization: 'json',
          })
      } else {
        const addCommand = this.commandSelector.add
        addCommand.commandArgs.args.push(...packages) // Add packages or args :^) 
        command = spawn(
          addCommand.commandArgs.name,
          addCommand.commandArgs.args,
          {
            cwd: path.resolve(this.resolved),
            shell: true,
            stdio: 'inherit', // It's easier to develop having a little insight into package management.
            serialization: 'json',
          })
      }

      command.on('error', (error) => {
        logger.error(`:install().command<error>: ${error}`)
        rejects(error)
      })

      command.on('exit', (code) => {
        if (code != 0) {
          logger.error(`:install().command<exit>: Package Manager closed unexpectedly or was forced to close.`)
          rejects(null)
        }
      })

      command.on('close', (code) => {
        resolve()
      })
    })
  }



  async upgrade() {
    return new Promise((resolve, rejects) => {
      const command = spawn(
        this.commandSelector.upgrade.commandArgs.name,
        this.commandSelector.upgrade.commandArgs.args,
        {
          cwd: path.resolve(this.resolved),
          shell: true,
          stdio: 'inherit', // It's easier to develop having a little insight into package management.
          serialization: 'json',
        })

      command.on('error', (error) => {
        logger.error(`:upgrade().command<error>: ${error}`)
        rejects(error)
      })

      command.on('exit', (code) => {
        if (code != 0) {
          logger.error(`:upgrade().command<exit>: Package Manager closed unexpectedly or was forced to close.`)
          rejects(null)
        }
      })

      command.on('close', (code) => {
        resolve()
      })
    })
  }



  get #name() {
    return this.secretName ?? this.resolved.replace(/.*\//g, '')
  }

  getNameProject() {
    return this.#name
  }

  /**
   * Compile the project when the structure is Typescript.
   */
  async compile(isDeveloper) {

    if (typeof isDeveloper !== 'boolean') throw new Error(`This is not boolean...`)
    if (!this.settings.typescript) throw new Error(`Error ${this.resolved}: This structure is not just Typescript.`)

    if (isDeveloper) {
      return compileModeDeveloper(this.resolved, this.#name, {
        typescriptArgs: this.settings.typescriptArgs ?? [],
        projects: this.getNameProject()
      })
    }

    return compileModeProduction(this.resolved, this.#name, { projects: this.getNameProject() })
  }

  /**
   * Initialize the application 
   */
  async runner() {
    return this.application.start()
  }
}


