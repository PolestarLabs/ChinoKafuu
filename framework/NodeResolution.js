import { EventEmitter } from 'events'
import { LoggerSystem } from './logger/defineLogger.js'
import { Node } from './packageManager/builder.js'


const logger = new LoggerSystem('NodeResolution')


// Check if application is using --dev argument. What this enabled in general.
const isDeveloper = () => process.argv.includes('--dev')
const upgradeArg = () => process.argv.includes('--upgrade-packages')
const installPackageMode = () => process.argv.includes('installPackage')
const repositoryPackageMode = () => process.argv.includes('--repository')


export class NodeResolution extends EventEmitter {
  constructor(node) {
    super()
    this.resolution = node
    this.list = ['installPackage', 'package', 'upgrade', 'compile', 'run']
  }

  async test() {
    return this.resolution.test()
  }

  async start() {
    const modeInstallPackage = installPackageMode()


    if (modeInstallPackage) {
      logger.debug(`Package install mode enabled.`)
    }

    const modePackage = (modeInstallPackage || repositoryPackageMode())
    for (const i of this.list) {
      const node = this.resolution

      if (node instanceof Node) {

        if (node.isThisRepositoryThatInstallsPackages()) return logger.debug(`Is this repository ${node.getNameProject()} that installs the packages? ${node.isThisRepositoryThatInstallsPackages()}`)
        if (i === 'installPackage' && modePackage) {
          logger.log(`Preparing to install the packages on repository ${node.getNameProject()}..`)
          await node.installPackage()
          break
        }

        // Package Manager
        if (i === 'package' && node.options.requiredInstallationOfPackages) {
          if (modeInstallPackage) return


          logger.log(`${node.getNameProject()}: Preparing to install. packageManager=${node.packageManager}.`)
          try {
            await node.install()  // Install packages
          } catch (error) {
            logger.error(`Project Error ${node.getNameProject()}: ${error}`)
            break
          }
          return
        }


        if (i === 'upgrade' && (node.options.requiredInstallationOfPackages || upgradeArg())) {
          logger.log(`${node.getNameProject()}: Preparing to upgrade packages. packageManager=${node.packageManager}.`)
          try {
            await node.upgrade()  // Upgrade packages
          } catch (error) {
            logger.error(`Project Error ${node.getNameProject()}: ${error}`)
            break
          }
          return
        }


        // @Typescript
        if (i === 'compile' && node.settings.typescript) {
          if (modeInstallPackage) return

          let errorCompile = false
          await node.compile(isDeveloper()).catch(() => errorCompile = true) // Compile projects

          if (errorCompile) {
            logger.error(`Typescript Compiler: The ${node.getNameProject()} cannot be started, maybe jump to another project.`)
            break
          }
          return
        }

        if (i === 'run' && !modeInstallPackage) {


          let errorCompile = false
          await node.runner().catch(() => errorCompile = true)

          if (errorCompile) {
            logger.error(`NodeApplication Runner: The ${node.getNameProject()} cannot be started, maybe jump to another project.`)
            break
          }
        }

      }
    }
  }

}

