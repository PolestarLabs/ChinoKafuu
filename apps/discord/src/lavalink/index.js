import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Logger } from '../structures/util'

const load=(path='') => {
  let file=null
  let detectFileExample=false
  let loaded=false
  if (path.endsWith('.example')) {
    detectFileExample=true
  }
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    file=readFileSync(path)
    loaded=true
  } catch (err) {
    if ((err.message.search(/ENOENT/g)===0)&&!detectFileExample) {
      Logger.info('The Lavalink configuration was not loaded because the file called "LavalinkConfig.json" in the "src/lavalink" directory was not created or could not be found.')
    } else {
      loaded=false
      if (!detectFileExample) {
        Logger.error(err)
      }

    }
  }

  return {
    loaded,
    detectFileExample,
    file: file===null? null:[...JSON.parse(file).connect]
  }
}
// fallback for test env
const loadSettings=() => {
  const pathLavalinkConfig=resolve('src', 'lavalink', 'LavalinkConfig.json')
  const pathLavalinkConfigExample=resolve('src', 'lavalink', 'LavalinkConfig.json.example')
  const loadConfigurationLavalink=load(pathLavalinkConfig)
  const loadConfigurationLavalinkExample=load(pathLavalinkConfigExample)

  if (loadConfigurationLavalink.loaded&&loadConfigurationLavalinkExample.loaded) {
    Logger.warning('So the directory doesn\'t get messed up you can remove `LavalinkConfig.json.example`')
  }

  if (loadConfigurationLavalink.loaded) {
    Logger.info(`The directory of ${pathLavalinkConfig} successfully loaded Lavalink configuration!`)
  } else {
    return undefined
  }

  return loadConfigurationLavalink.file
}

export const getConfigLavalink = function () {
  const config=loadSettings()
  return config.map((node) => ({
    ip: typeof node.host === 'string' ? node.host : '',
    ...(typeof node?.port === 'string' ? { port: parseInt(node.port) } : { }),
    ...(typeof node?.password === 'string' ? { password: node.password } : { }),
    ...(typeof node?.version === 'string' ? { version: node.version } : { 'version': 'auto' }),
  }))
}