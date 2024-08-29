import { spawn } from 'child_process'
import { LoggerSystem } from '../logger/defineLogger.js'

const logger = new LoggerSystem('utils.typescriptCompile')

/**
 * Just compile and initialize the application. It loses watch function as well as in develop mode.
 */
const compileModeProduction = async (resolved, name = 'unknown', options = { projects: '' }) => {
  logger.log(`Compiling project from ${name}.`)
  return new Promise((resolve, rejects) => {
    const ts = spawn('tsc --pretty', {
      cwd: resolved,
      shell: true,
      serialization: 'json',
    })


    ts.stdout.on('data', (data) => {
      // Clear Console:
      // \x1Bc
      let message = data.toString().replace(/\x1Bc/g, '')

      if (message.length <= 2) {
        return
      }
      process.stdout.write(`\n\n[${options.projects}]   ${message.toString()}\n`)
      if (message.match(/(error|erro)|TS[A-Za-z0-9-]+/g) !== null) {
        rejects()
      }
    })

    ts.stderr.on('data', (data) => {
      // Clear Console:
      // \x1Bc
      let message = data.toString().replace(/\x1Bc/g, '')

      if (message.length <= 2) {
        return
      }

      logger.error('Typescript Compiler Error:\n')
      process.stdout.write(`\n\n[${options.projects}]   ${message.toString()}\n`)
    })

    ts.on('exit', () => {
      resolve()
    })
  })
}

/**
 * This function is used to update the Typescript application which automatically triggers application startup.
 * 
 *
 * Quickly and conveniently without having to waste time to reset the typescript or update some modules. 
 * All modules are removed from the cache.
 * 
 * 
 * 
 */
const compileModeDeveloper = async (resolved, name = 'unknown', options = { typescriptArgs: ['-w'], projects: '' }) => {
  logger.log(`Watch Mode has been enabled in the project: ${name}`)
  return new Promise((resolve, rejects) => {
    const execTs = () => {
      const ts = spawn('tsc -w --pretty', options.typescriptArgs, {
        cwd: resolved,
        shell: true,
        serialization: 'json',
      })


      ts.stdout.on('data', (data) => {
        // Clear Console:
        // \x1Bc
        let message = data.toString().replace(/\x1Bc/g, '')

        if (message.length <= 2) {
          return
        }

        process.stdout.write(`\n[${options.projects}]   ${message.toString()}`)
      })

      ts.stderr.on('data', (data) => {
        logger.error(data.toString())
      })

      ts.on('spawn', () => {
        resolve({
          ok: true,
          tsProcess: ts
        })
      })


      ts.on('exit', () => {
        logger.log('Oh no! It looks like typescript was forcibly terminated.')

        execTs()
      })
    }

    execTs()
  })
}


export {
  compileModeProduction,
  compileModeDeveloper
}

