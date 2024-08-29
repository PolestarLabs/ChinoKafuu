
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { NodeLinkResolver } from './NodeLinkResolver.js'
import { initializeCacheManager } from './cache.js'
import { watchStart } from './developer/WatchCommand.js'
import { WebSocketServerDeveloper } from './developer/WebsocketServerDeveloper.js'
import { LoggerSystem } from './logger/defineLogger.js'
import { executeCommand } from './utils/helperCommand.js'
import { resolveDir } from './utils/resolveDir.js'
/**
 * Initialize `.chinokafuu` folder
 */
const checkDir = () => {
  if (!existsSync('.chinokafuu')) {
    mkdirSync('.chinokafuu', { recursive: true })
  }
  if (!existsSync('.chinokafuu/cache/image')) {
    mkdirSync('.chinokafuu/cache/image', { recursive: true })
  }
  if (!existsSync('.chinokafuu/cache/tmp')) {
    mkdirSync('.chinokafuu/cache/tmp', { recursive: true })
  }
  if (!existsSync('.chinokafuu/cache/map')) {
    mkdirSync('.chinokafuu/cache/map', { recursive: true })
  }
  if (!existsSync('.chinokafuu/image/resize')) {
    mkdirSync('.chinokafuu/image/resize', { recursive: true })
  }
  if (!existsSync('.chinokafuu/locale/cache')) {
    mkdirSync('.chinokafuu/locale/cache', { recursive: true })
  }
  if (!existsSync('.chinokafuu/apps/tsc')) {
    mkdirSync('.chinokafuu/apps/tsc', { recursive: true })
  }
  if (!existsSync('.chinokafuu/test')) {
    mkdirSync('.chinokafuu/test', { recursive: true })
  }
  if (!existsSync('.chinokafuu/lavalink/tracks')) {
    mkdirSync('.chinokafuu/lavalink/tracks', { recursive: true })
  }
  if (!existsSync('.chinokafuu/tmp')) {
    mkdirSync('.chinokafuu/tmp', { recursive: true })
  }
}


// Clear chat :)
if (process.argv.includes('--clear-log')) {
  process.stdout.write(`\x1Bc`)
}



const packageFramework = () => {
  const p = JSON.parse(readFileSync(resolve('package.json')))

  return p
}


const logger = new LoggerSystem('FrameworkRepository')




const startFramework = async () => {
  const isManagerPackage = process.argv.find((i) => i == '--installPackage')
  if (!isManagerPackage) {
    // check /.chinokafuu/*
    checkDir()


    initializeCacheManager()
  }


  // Start WebSocketServerDeveloper
  const t = packageFramework()
  logger.log(`The ${t.name} is working with version ${t.version}`)

  const dirs = await resolveDir()
  const link = NodeLinkResolver.new(dirs, false)
  let filtered = link.nodes

  if (process.argv.includes('--no-ts')) {
    filtered = link.nodes.filter((node) => node.settings.typescript === false)
  }

  const server = new WebSocketServerDeveloper(link)
  for (const node of filtered) {
    await node.resolution.start()
  }
}

if (!executeCommand() && !watchStart()) {
  startFramework()
}




