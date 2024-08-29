import { existsSync, readFileSync, readdirSync, watch } from 'fs'
import { basename } from 'path'
import { LoggerSystem } from './logger/defineLogger.js'

let awaitLoad = false

/**
 * @typedef {{
 *  expire?:number;
 *  status: boolean;
 *  typeCache: 'DO_NOT_CACHE' | 'CACHING_ENABLED' | 'CACHE_LIMITED';
 *  contentType?: 'gif' | 'image/jpeg' | 'image/jpg' | 'image/png';
 *  typeFile?: 'gif' | 'image/jpeg' | 'image/jpg' | 'image/png'
 * }} cacheMetadata
 *  
 * */
const isManagerPackage = process.argv.find((i) => i === '--installPackage')
const logger = new LoggerSystem('CacheManager')
const sleep = async () => new Promise((resolve) => setTimeout(resolve, 2 * 1000))
const dirs = [
  'cache/image',
  'cache/tmp',
  'cache/map'
]
const watchDir = (path, callback) => !isManagerPackage ? watch(`.chinokafuu/${path}`, { }, callback) : null
const readDirCallback = (path) => !isManagerPackage  ? readdirSync(`.chinokafuu/${path}`) : null
const readFileCallback = (path) => !isManagerPackage ? readFileSync(`.chinokafuu/${path}`) : null
const checkPath = (path) => !isManagerPackage  ? existsSync(`.chinokafuu/${path}`) : null

export class CacheManager {
  constructor(path = '.chinokafuu') {
    /**
     * @type {Array<{path?: string; type?: 'cache/image' | 'cache/tmp' | 'cache/map'; module?: CacheFile | null; waiting?: boolean;}>}
     */
    this.cache = []
    this.cacheSaved = []
    this.image = watchDir('cache/image', (...args) => {
      const [event, path] = args
      if (event === 'rename' || event === 'change') {
        this.event(event, path, 'cache/image')
      }
    })
    this.tmp = watchDir('cache/tmp', (...args) => {
      const [event, path] = args
      if (event === 'rename' || event === 'change') {
        this.event(event, path, 'cache/tmp')
      }
    })
    this.map = watchDir('cache/map', (...args) => {
      const [event, path] = args
      if (event === 'rename' || event === 'change') {
        this.event(event, path, 'cache/map')
      }
    })
    this.loadCache()
  }

  loadCache() {
    const cacheModuleMap = readDirCallback('cache/map')
    for (const moduleMap of cacheModuleMap) {
      this.cache.push({
        path: moduleMap,
        type: 'cache/map',
        module: CacheFile.readMap(moduleMap, 'cache/map', this, true),
        waiting: false
      })
    }
    logger.log(`${cacheModuleMap.length.toLocaleString()} modules were loaded in the cache/map box!`)
  }

  async event(eventType = '', path = '', type = '') {
    if (existsSync(path)) return;
    if (type === 'cache/map') {
      if (this.cache.find((data) => data.path) == undefined) {
        this.cache.push({
          path: path,
          type: type,
          module: CacheFile.readMap(path, type, this),
          waiting: false
        })
      } else if (this.cache.find((data) => data.path) !== undefined) {
        const findCache = this.cache.find((data) => data.path)
        if (findCache === undefined) return
        const cache = findCache
        const moduleCache = cache.module

        if (!checkPath(findCache.type + '/' + findCache.path)) {
          const getCache = this.cache.findIndex((data) => data.path)
          this.cache.splice(getCache, 1)
          logger.debug(`removed __**"${moduleCache?.nameOfCache ?? 'unknown'}"**__ as cache with **${((moduleCache?.file?.sizeOfFile ?? 0) / 1024).toFixed(1)} kB** in the **${moduleCache?.type ?? 'cache/unknown'}** sector.`)
        } else {
          let tryloadJSON = 0
          let antiSpam = false
          if (awaitLoad == false) awaitLoad = true
          let updated = () => {
            awaitLoad = false
          }
          while (!moduleCache.update(path, type, updated)) {
            await sleep()
            tryloadJSON++
            if (tryloadJSON >= 90) {
              logger.error(`ErrorModuleCache: Unable to load ${type + '/' + path} because it's either malformed or not a JSON file.`)
              break
            }
            if (!antiSpam) {
              logger.error('ErrorModuleCache: Wooow! That was too fast for the buffer to write to the file. Let\'s try again.')
              antiSpam = true
            }
          }
        }
      }
    } else if (type === 'cache/image') {
      const cache = this.cache.find((data) => data?.module?.parent === basename(path))
      if (cache === undefined) return
      cache.module.checkFile(false, true, existsSync(cache?.module?.parent))
    }
  }

}

export const initializeCacheManager = () => {
  logger.log('CacheManager started!')
  return new CacheManager('.chinokafuu')
}

export class CacheFile {
  constructor(map, cacheManager, noEmit = false) {
    this.started = false
    this.timeout = 0
    this.loaded = false
    this.checking = false
    this.saved = false
    this.cacheManager = cacheManager
    this.await = false
    this.nameOfCache = map?.name ?? null
    this.metadata = map?.metadata ?? null
    this.details = map?.details ?? null
    this.parentOld = ''
    this.parent = map?.parent ?? null
    this.path = map?.path ?? null
    this.date = map?.date ?? null
    this.type = map?.type ?? null
    this.flags = map.flags ?? []
    this.file = map?.file ?? null
    this.metadataFile = map?.metadata_file ?? null
    this.intervalCheck = null
    if (!noEmit) {
      logger.debug(`saving __**"${this.nameOfCache}"**__ as cache with **${(this.file.sizeOfFile / 1024).toFixed(1)} kB** in the **${this.type}** box.`)
    }
    this.checkFile(false, true)
  }

  checkFile(silent = false, force = false, exists = true) {
    const reset = (exist) => {
      clearInterval(this.intervalCheck)
      this.loaded = true
      this.saved = exist
      this.checking = false
      this.await = false
      this.started = true
      this.intervalCheck = null
    }
    if (this.checking || force) {
      let tryAgain = 0
      if (this.intervalCheck != null) return
      this.await = true
      this.intervalCheck = setInterval(() => {
        tryAgain++
        let exist = checkPath(this.type + '/' + this.parent)
        if (tryAgain >= 30) {
          clearInterval(this.intervalCheck)
          this.intervalCheck = null
          if (this.started) {
            logger.warn(`The cache called **"${this.nameOfCache}"** seems to have been removed, so it's not possible to store it in the **${this.type}** box.`)
          }
          return
        }
        if (exist) {
          if (this.loaded == true && this.started) {
            if (exists) {
              if (this.parentOld === '' && this.parent === this.parentOld) {
                logger.log(`The cache **"${this.nameOfCache}"** was successfully updated in box **${this.type}**!`)
              } else {
                logger.warn(`The cache called **"${this.nameOfCache}"** has been restored back to box **${this.type}** again.`)
              }
              logger.debug({ name: this.nameOfCache, FLAGS: this.flags, parent: this.parent })
            }

          }
          reset(exist)
        }
      }, 300);
      return
    }

    this.checking = true
  }

  update(path, type, callback) {
    if (!checkPath(type + '/' + path)) return null
    const file = readFileCallback(type + '/' + path)
    try {
      const map = JSON.parse(file)
      this.nameOfCache = map?.name ?? null
      this.metadata = map?.metadata ?? null
      this.details = map?.details ?? null
      this.parentOld = this.parent
      this.parent = map?.parent ?? null
      this.path = map?.path ?? null
      this.date = map?.date ?? null
      this.type = map?.type ?? null
      this.flags = map.flags ?? []
      this.file = map?.file ?? null
      this.metadataFile = map?.metadata_file ?? null
      callback()
      return true
    } catch (err) {
      return false
    }
  }
  static readMap(path, type = '', cacheManager, noEmit = false) {
    if (!checkPath(type + '/' + path)) return null
    const file = readFileCallback(type + '/' + path)
    const json = JSON.parse(file)

    return new CacheFile(json, cacheManager, noEmit)
  }
}