import { readdir, readdirSync, stat } from 'fs'
import { resolve } from 'path'

const forceInstall = process.argv.includes('--force-install')



/**
 * We don't need to list node_modules and .git, .github or yarn.lock.
 */
const badDir = (name) => {
  if (typeof name !== 'string') throw Error('Oops! Broke here, this doesn\'t look like a string.')

  return [
    'node_modules',
    '.git',
    '.github',
    'framework',
    'launcher',
  ]
    .filter((e) => e.endsWith(name))[0] != undefined
}


/**
 * Check if the repository is valid.
 */
const repositoryCheck = (list = [''], path = null) => {
  if (!Array.isArray(list)) throw Error('Oops! This is not a list...')
  if (path != null) {
    list = readdirSync(path)
  }
  const packageFilter = list.filter((k) => k.endsWith('package.json'))[0] != undefined
  const settingsFilter = list.filter((k) => k.endsWith('settingsFramework.json'))[0] != undefined

  return packageFilter && settingsFilter
}


/**
 * Check if the repository has the node_modules folder. It is usually difficult to identify if there is a corrupted package. 
 * More framework can background check packages.
 * 
 * 
 * 
 * We cannot open the folder to calculate the amount of packages it has in it. 
 * else we can use stat to check the size of the folder.
 * 
 * 
 * 
 * 
 * That at least we can lessen the packet load.
 */
const requiredInstallationOfPackages = (list = [''], path = null) => {
  if (!Array.isArray(list)) throw Error('Oops! This is not a list...')
  if (path != null) {
    list = readdirSync(path)
  }

  const nodeModulesFilter = list.filter((k) => k.endsWith('node_modules'))[0] === undefined || forceInstall


  return nodeModulesFilter
}


/**
 * 
 * Check if the directory contains settingsFramework.json and package.json
 */
export const resolveDir = async (
  dir = null,
  locked = false,
  dirMap = null,
  promise = null
) => {

  let directoryIsNull = false
  let dirs = []
  const dirsCache = dirMap === null ? false : true
  let isDirectory = true
  let lock = false

  if (locked) return { isDirectory, dirs, repositoryCheck: false, requiredInstallationOfPackages: false }

  if (dir === null) {
    dir = resolve()
    directoryIsNull = true
  }

  const readDir = async () => new Promise((resolveRead) => {
    readdir(dir, async (err, files) => {
      if (err) return isDirectory = false

      // Check if this folder is a repository.
      if (repositoryCheck(files)) {
        lock = true // Block this from parsing further.
      }
      for (const k of files) {
        if (!badDir(k)) {
          // Resolve folder or file encounter.
          let path = resolve(directoryIsNull ? k : dir + `/${k}`)

          // Check folder items.
          //
          // If this gives an error in windows it is probably that the folder is blocked or being prevented from accessing it.
          const statSync = async () => new Promise((resolve) => {
            stat(path, async (err, stats) => {
              if (err) throw new Error(`Err Stat: ${err}`)

              if (stats.isDirectory()) {
                const dirResolved = async () => await resolveDir(path, lock, dirs, resolve)
                const d = await dirResolved()

                // This is to avoid endless looping and looping of directory data.
                // 
                // I know this is a mess... T-T
                if (dirsCache) {
                  dirMap.push({
                    d,
                    path,
                    repositoryCheck: repositoryCheck(files, path),
                    requiredInstallationOfPackages: requiredInstallationOfPackages(files, path)
                  })
                } else {
                  dirs.push({ d, path, repositoryCheck: repositoryCheck(files), requiredInstallationOfPackages: false })
                }

              }
              resolve()
            })

          })
          await statSync() // Expect future promise of folder analysis.
        }
      }

      resolveRead()


    })
  })


  await readDir()

  return { isDirectory, dirs }
}