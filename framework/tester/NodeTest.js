import { spawn } from 'child_process'
import { LoggerSystem } from '../logger/defineLogger.js'
const logger = new LoggerSystem('NodeTest')


export class NodeTest {
  constructor(node) {
    this.node = node
    this.testers = ['jest', 'eslint']
  }

  jest() {
    console.log('\n')
    logger.log(`Starting a Jest in repository ${this.node.getNameProject()}`)
    console.log('\n')
    return new Promise((resolved, rejects) => {
      if (process.argv0.includes('--lint')) return;
      const test = spawn('yarn', ['test'], {
        cwd: this.node.resolved,
        shell: true,
        stdio: 'inherit',
        serialization: 'json',
      })


      test.on('error', (err) => {
        logger.error(`An error occurred while running the Jest test: ${err}`)
        rejects(`An error occurred while running the Jest test: ${err}`)
      })


      test.on('exit', (code) => {
        if (code === 0) {
          console.log('================================================')
          resolved()
          return
        } else if (code === 1) {
          process.exit(1)
        } else {
          logger.error(`An error occurred while running the Jest test:\n\n  - Jest terminated unexpectedly. Restart application.\n  - Code: ${code}\n\n`)
        }


      })
    })
  }


  eslint() {
    console.log('\n')
    logger.log(`Starting a Eslint in repository ${this.node.getNameProject()}`)
    console.log('\n')
    return new Promise((resolved, rejects) => {
      if (!process.argv0.includes('--lint')) return;
      const test = spawn('yarn', ['test:lint'], {
        cwd: this.node.resolved,
        shell: true,
        stdio: 'inherit',
        serialization: 'json',
      })


      test.on('error', (err) => {
        logger.error(`An error occurred while running the Eslint test: ${err}`)
        rejects(`An error occurred while running the Eslint test: ${err}`)
      })

      test.on('exit', (code) => {
        console.log('================================================')
        console.log('\n')
        if (code === 0) {
          resolved()
          return
        } else if (code === 1) {
          console.log('\n\n\n\n\n')
          process.exit(1)
        } else {
          logger.error(`An error occurred while running the Eslint test:\n\n  - Eslint terminated unexpectedly. Restart application.\n  - Code: ${code}\n\n`)
        }
      })
    })
  }

  async runTest() {
    for (const test of this.testers) {

      if (test === 'jest') {
        await this.jest()
      }


      if (test === 'eslint') {
        await this.eslint()
      }
    }
  }
}