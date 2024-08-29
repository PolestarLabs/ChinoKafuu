/* eslint-disable security/detect-non-literal-fs-filename */
import axios from 'axios'
import { Buffer } from 'node:buffer'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

import fs, { join } from 'node:path'
import { constants, deflateRawSync, inflateRawSync } from 'node:zlib'

/**
 *
 * @param {*} name Add an extra identifier to include in the cache information
 * @param {boolean} disabled Disable auto-delete of cache. (Make the framework not remove this cache temporarily)
 * @param {{
 *  expire?:number;
 *  status: boolean;
 *  typeCache: 'DO_NOT_CACHE' | 'CACHING_ENABLED' | 'CACHE_LIMITED';
 *  contentType?: 'gif' | 'image/jpeg' | 'image/jpg' | 'image/png';
 *  typeFile?: 'gif' | 'image/jpeg' | 'image/jpg' | 'image/png'
 * }} cached
 * @returns
 */
const genID = (name, disabled, cached = {}) => {
  return {
    name,
    disabled,
    cached: {
      expire: 20 * 1000,
      status: false,
      typeCache: 'DO_NOT_CACHE',
      contentType: null,
      typeFile: null, ...cached
    }
  }

}
export const ConstantBackground = {
  'chino_woaaah': {
    name: 'chino_woaaah',
    id: genID('chino_woaaah', false, { contentType: 'gif', typeFile: 'gif' }),
    title: 'Chino Woaaah',
    emoji: {
      id: '628330389764571157',
      name: 'chino_excited',
      animated: true
    },
    disabled: false,
    cached: false,
    animated: true,
  },
  'gochiusa_1': {
    name: 'gochiusa_1',
    id: genID('gochiusa_1', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Gochiusa 1',
    emoji: {
      id: null,
      name: '1️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'gochiusa_2': {
    name: 'gochiusa_2',
    id: genID('gochiusa_2', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Gochiusa 2',
    emoji: {
      id: null,
      name: '2️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'gochiusa_3': {
    name: 'gochiusa_3',
    id: genID('gochiusa_3', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Gochiusa 3',
    emoji: {
      id: null,
      name: '3️⃣',
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'gochiusa_4': {
    name: 'gochiusa_4',
    id: genID('gochiusa_4', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Gochiusa 4',
    emoji: {
      id: null,
      name: '4️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'gochiusa_5': {
    name: 'gochiusa_5',
    id: genID('gochiusa_5', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Gochiusa 5',
    emoji: {
      id: null,
      name: '5️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'mctha_red': {
    name: 'mctha_red',
    id: genID('mctha_red', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Mctha Red',
    emoji: {
      id: null,
      name: '⭐'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'no_game_no_life_1': {
    name: 'no_game_no_life_1',
    id: genID('no_game_no_life_1', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'No Game No Life 1',
    emoji: {
      id: null,
      name: '1️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'no_game_no_life_2': {
    name: 'no_game_no_life_2',
    id: genID('no_game_no_life_2', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'No Game No Life 2',
    emoji: {
      id: null,
      name: '2️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'nyc_skyline': {
    name: 'nyc_skyline',
    id: genID('nyc_skyline', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'NYC Skyline',
    emoji: {
      id: null,
      name: '🌆',
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'show_by_rock_1': {
    name: 'show_by_rock_1',
    id: genID('show_by_rock_1', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Show By Rock 1',
    emoji: {
      id: null,
      name: '1️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'show_by_rock_2': {
    name: 'show_by_rock_2',
    id: genID('show_by_rock_2', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Show by Rock 2',
    emoji: {
      id: null,
      name: '2️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'show_by_rock_3': {
    name: 'show_by_rock_3',
    id: genID('show_by_rock_3', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Show By Rock 3',
    emoji: {
      id: null,
      name: '3️⃣',
    },
    disabled: false,
    cached: false,
    animated: false,
  },
  'show_by_rock_4': {
    name: 'show_by_rock_4',
    id: genID('show_by_rock_4', false, { contentType: 'image/png', typeFile: 'image/png' }),
    title: 'Show by Rock 4',
    emoji: {
      id: null,
      name: '4️⃣'
    },
    disabled: false,
    cached: false,
    animated: false,
  },
}

// const versionExperimental = () => false

const Actions = ['renderProfile', 'renderLaranjo', 'renderLicense', 'renderRize', 'version']
const defineObject = (data = {}) => ({
  buffer: Buffer,
  byteLength: 0,
  length: 0,
  ...data
})

/**
 *
 * @param {{action: string;render: {buffer: BufferConstructor;byteLength: number;length: number; }; timeRequest: number;}} data
 * @returns
 */
const defineMetadata = (data = {}) => ({
  action: '', // String
  render: defineObject({}), // Buffer,
  timeRequest: 0,
  ...data
})

const profileStruct = (defineOptions = {}) => ({
  avatarUrl: '',
  bgId: '',
  stickerId: '',
  reps: '',
  married: false,
  name: '',
  aboutMe: '',
  favColor: '',
  money: '',
  type: '',
  badges: null,
  partnerName: '',
  avatarIcon: '',
  ...defineOptions
})

const laranjoStruct = (text = '') => (typeof text === 'string' ? { text } : (() => {
  throw `This is not a text, it appears to be: ${typeof text}`
})())

const licenseStruct = (defineOptions = {}) => ({
  text: '',
  name: '',
  avatarUrl: '',
  hexColor: '',
  ...defineOptions
})

const rizeStruct = (text = '') => (typeof text === 'string' ? { text } : (() => {
  throw `This is not a text, it appears to be: ${typeof text}`
})())

export const optionsTokamak = {
  tokamakUrl: process.env.TOKAMAK_URL,
  action: '',
  profileStruct: profileStruct(),
  laranjoStruct: laranjoStruct(),
  licenseStruct: licenseStruct(),
  rizeStruct: rizeStruct()
}

// Endpoint
// https://github.com/RabbitHouseCorp/tokamak/blob/master/src/server/server.go
const Endpoints = (url) => ({
  render: url + '/render/profile?w=600&h=400&type=thumb',
  version: url + 'version',
  renderLicense: url + '/render/license',
  renderRize: url + '/render/rize',
  renderLaranjo: url + '/render/laranjo',
  getBackground: url + '/get_backgrounds'
})

// Resolve image type.
const defineImageBufferTokamak = (contentType = '', buffer = {}) => {
  return defineObject({
    buffer: buffer,
    byteLength: buffer.byteLength,
    length: buffer.length,
    contentType
  })
}

const renderProfile = async (options = optionsTokamak) => {
  return new Promise((resolve, rejects) => {
    axios({
      url: Endpoints(options.tokamakUrl).render,
      method: 'post',
      data: options.profileStruct,
      responseType: 'arraybuffer'
    })
      .then((request) => {
        const time = Date.now()
        const buffer = defineImageBufferTokamak(request.headers.getContentType(), request.data)
        resolve(defineMetadata({
          timeRequest: time - Date.now(),
          ...buffer,
          ...options
        }))
      })
      .catch((error) => rejects(error))
  })
}

const renderLaranjo = async (options = optionsTokamak) => {
  return new Promise((resolve, rejects) => {
    return axios({
      url: Endpoints(options.tokamakUrl).renderLaranjo,
      method: 'post',
      data: options.laranjoStruct,
      responseType: 'arraybuffer'
    })
      .then((request) => {
        const time = Date.now()
        const buffer = defineImageBufferTokamak(request.headers.getContentType(), request.data)
        resolve(defineMetadata({
          timeRequest: time - Date.now(),
          ...buffer,
          ...options
        }))
      })
      .catch((error) => rejects(error))
  })
}

const renderLicense = async (options = optionsTokamak) => {
  return new Promise((resolve, rejects) => {
    return axios({
      url: Endpoints(options.tokamakUrl).renderLicense,
      method: 'post',
      data: options.licenseStruct,
      responseType: 'arraybuffer'
    })
      .then((request) => {
        const time = Date.now()
        const buffer = defineImageBufferTokamak(request.headers.getContentType(), request.data)
        resolve(defineMetadata({
          timeRequest: time - Date.now(),
          ...buffer,
          ...options
        }))
      })
      .catch((error) => rejects(error))
  })
}

const renderRize = async (options = optionsTokamak) => {
  return new Promise((resolve, rejects) => {
    return axios({
      url: Endpoints(options.tokamakUrl).renderRize,
      method: 'post',
      data: options.rizeStruct,
      responseType: 'arraybuffer'
    })
      .then((request) => {
        const time = Date.now()
        const buffer = defineImageBufferTokamak(request.headers.getContentType(), request.data)
        resolve(defineMetadata({
          timeRequest: time - Date.now(),
          ...buffer,
          ...options
        }))
      })
      .catch((error) => rejects(error))
  })
}

/**
 *
 * @param {keyof ConstantBackground} name
 * @param {cache: boolean} [options]
 * @returns {Promise<Buffer | null | undefined>}
 */
export const getBackground = async (name, options = { cache: false }) => {
  const backgroundData = Object.entries(ConstantBackground)
    .find(([k]) => k === name)
  const [findBackground, backgroundInfo] = backgroundData ?? [null, null]
  if (findBackground === null && findBackground === null)
    throw Error(`Tokamak.getBackground: You provided the wrong background name, I'm receiving: ${name}`)
  const pathDirOfApp = fs.resolve('../', '../', '.chinokafuu/cache/image')
  const pathDirOfMap = fs.resolve('../', '../', '.chinokafuu/cache/map')
  if (options !== undefined && options.cache) {
    const checkFramework = existsSync(pathDirOfApp)
    if (checkFramework) {
      const nameOfMap = (Buffer.from(backgroundInfo.name).toString('base64') + '.json').replace(/\\|\//g, '')
      if (existsSync(join(pathDirOfMap, nameOfMap))) {
        const checkCacheMap = readdirSync(join(pathDirOfMap))
        if (checkCacheMap.find((c) => c === nameOfMap) !== undefined) {
          const readMap = JSON.parse(readFileSync(join(pathDirOfMap, nameOfMap)))
          const pathImage = join(pathDirOfApp, readMap.parent)
          if (existsSync(pathImage)) {
            return inflateRawSync(readFileSync(pathImage), {
              level: constants.Z_BEST_SPEED
            })
          }
        }
      }
    } else {
      mkdirSync(pathDirOfApp, { recursive: true })
    }
  }
  return new Promise((resolve, reject) => {
    const startTimestamp = Date.now()
    return axios({
      url: (Endpoints(process.env.TOKAMAK_URL).getBackground + '/' + backgroundInfo.name + '.png'),
      method: 'get',
      responseType: 'arraybuffer'
    })
      .then((request) => {
        const endTimestamp = Date.now()
        if (request.status != '200' && request.status != '201')
          throw Error(`Tokamak.getBackground: 'Status Code invalid: ${request.statusText}'`)
        if (request.data instanceof Buffer && (options !== undefined && options.cache)) {
          const compressData = deflateRawSync(request.data, {
            level: constants.Z_BEST_COMPRESSION
          })
          const id = Buffer.from(randomBytes(40 * 1)).toString('base64').replace(/\\|\//g, '')
          const nameOfMap = (Buffer.from(backgroundInfo.name).toString('base64') + '.json').replace(/\\|\//g, '')
          const data = JSON.stringify({
            name: backgroundInfo.name,
            metadata: backgroundInfo.id,
            details: {
              isRequest: false,
              startTimestamp,
              endTimestamp
            },
            date: Date.now(),
            type: 'cache/image',
            flags: ['CACHE_IMAGE', 'BACKGROUND', 'DATA', 'TOKAMAK'],
            path: `image/${id}`,
            parent: id,
            file: {
              compress: true,
              sizeOfFile: compressData.byteLength,
              sizeOfFileOriginal: request.data.byteLength
            },
            metadata_file: Buffer.from(JSON.stringify({
              data: [backgroundInfo, constants.Z_BEST_COMPRESSION, constants.Z_BEST_SPEED]
            })).toString('base64')
          })
          writeFileSync(join(pathDirOfMap, nameOfMap), data)
          writeFileSync(join(pathDirOfApp, id), compressData, {})
        }
        resolve(request.data)

      })
      .catch((error) => reject(error))
  })
}

export const requestTokamak = async (options = optionsTokamak) => {
  if (options !== undefined) {
    options = { ...optionsTokamak, ...options }
  }

  if (!Actions.includes(options.action)) throw `This chosen action does not exist, only: ${Actions.join(', ')}`

  return new Promise((resolve, rejects) => {
    if (options.action === 'renderProfile') {
      renderProfile(options)
        .then((render) => resolve(render))
        .catch((error) => rejects(error))
    } else if (options.action === 'renderLaranjo') {
      renderLaranjo(options)
        .then((render) => resolve(render))
        .catch((error) => rejects(error))
    } else if (options.action === 'renderLicense') {
      renderLicense(options)
        .then((render) => resolve(render))
        .catch((error) => rejects(error))
    } else if (options.action === 'renderRize') {
      renderRize(options)
        .then((render) => resolve(render))
        .catch((error) => rejects(error))
    }
  })
}