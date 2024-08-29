import EventEmitter from 'events'

const MAX_TIME = 640000000 // 24 hour

const isJson = (data) => {
  try {
    JSON.stringify(data)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @template T, R
 */
export class StateData {
  /**
   *
   * @param {T} actionState
   * @param {helper} helper
   */
  constructor(actionState) {
    this.actionState = actionState
    this.helper = {
      messageID: null,
      userID: null,
      channelID: null,
      id: Math.floor(Math.random() * 100000000000000),
      tasks: null,
      cache: null,
      update: false,
      once: false,
      broken: false
    }
    this.obj = {}
  }

  /**
   * @arg {(data: R, newData: R) => void} func
   * @arg {{ timeout?: number; once?: boolean}} options
   */
  useEffect(func, options = {}) {
    if (this.helper.once == false) {
      this.helper.once = true
    } else {
      return
    }
    if (typeof func !== 'function') throw new Error('That doesn\'t seem to be a function.')
    if (this.actionState.event !== undefined && this.actionState.event !== null) {
      if (options.once) {
        this.actionState.event.once('modify', ...func)
        return
      }
      this.actionState.event.on('modify', ...func)
      return
    }
    if (this.helper.tasks !== undefined || this.helper.tasks !== null) {
      clearInterval(this.helper.tasks)
    }
    const stopEffect = () => {
      this.helper.broken = true
      this.helper.once = false
      return null
    }
    const interval = setInterval(() => {
      if (this.helper.broken) {
        clearInterval(interval)
        return
      }
      let valid = true
      if (this.helper.cache == null) {
        valid = false
      }
      this.helper.cache = true

      if (valid && this.helper.update == true) {
        func({ ...(this.obj), stopEffect })
        this.helper.update = false
      }
    });
  }

  setMessageID(id) {
    this.helper.messageID = id
  }

  setUserID(id) {
    this.helper.userID = id
  }

  setChannelID(id) {
    this.helper.channelID = id
  }
}

/**
 * @template T,R
 * @typedef  StateEffect
 * @property {(property: T) => keyof property} get
 * @property {<S>(data: T) => StateDataEffect<T & S>} setState
 * @property {(property: keyof T) => StateDataEffect<T>} del
 * @property {(input: T) => void} modifyObject
 * @property {(func: ((data: T & R, newData: T & R) => void)) => void} useEffect
 * @property {import('events').EventEmitter | null} [event]
 * @property {() => void} destroy;
 * @memberof StateEffect
 */

/**
 * @template T
 * @typedef StateDataEffect
 * @type {StateData<StateEffect<T>, T> & T}
 */
export const StateDataEffect = {}

/**
 * @template T
 * @description This will help save unnecessary variable and after you are done and set the data to null and let the GC work.
 * @param {T} [state]
 * @param {{eventEmitter: boolean; ctx: any}} [options]
 * @returns {StateDataEffect<T>}
 */
export const defineState = (state = {}, options = { eventEmitter: false, ctx: null }) => {
  let stateData = null
  if ((typeof state !== 'object' || Array.isArray(state))) {
    if (Array.isArray(state)) throw new Error(`state invalid: state of data is [array]`)
    throw new Error(`state invalid: state of data is ${typeof state}`)
  }
  const event = options?.eventEmitter === true ? new EventEmitter() : null

  const get = (stateName) => {
    return Object.entries(state).filter(([key]) => key === stateName)[0][1] ?? null
  }
  const setState = (dataState = {}) => {
    if (!Array.isArray(dataState)) {
      Object.entries(dataState).map(([k]) => delete state[typeof k === 'string' ? k : ''])
    }
    Object.assign(state, dataState)
    if (event !== null) {
      event.emit('stateUpdated', dataState, state, state)
    }
    return state
  }

  const modifyObject = (data = {}, target) => {
    if (!Array.isArray(data) && typeof data === 'object') {
      if (typeof data !== 'object') throw new Error(`error to modify object: data is ${typeof data}`)
      Object.entries(data)
        .filter(([k]) => ['actionState', 'helper'].includes(k) == false)
        .map(([keyOriginal, values]) => {
          const getObj = Object.entries(state)
            .filter(([k]) => !['actionState', 'helper'].includes(k))
            .find(([keyObj]) => keyObj == keyOriginal)
          if (getObj == undefined || getObj == null) throw new Error(`key: "${keyOriginal}" not found in state.`)
          const [_, valueObj] = getObj
          if (event !== null) {
            event.emit('modify', data, state)
          } else {
            if (target?.helper?.update !== undefined) {
              Reflect.set(target.helper, 'update', true)
            }
          }
          Object.assign(state, Object.fromEntries([[keyOriginal, {
            ...valueObj,
            ...values
          }]]))
          Reflect.set(state, keyOriginal, {
            ...valueObj,
            ...values
          })
          Reflect.set(target, 'obj', state)
        })
    }
  }

  const postStructJson = (stateName, data) => {
    if (isJson(data))
      throw new Error('PostDataStateError: This doesn\'t appear to be JSON data.')

    const arr = Object.values([stateName, data])
    const obj = {}
    obj[arr[0]] = arr[1]
    Object.assign(state, obj)
    if (event !== null) {
      event.emit('postData', (state, stateName, data))
    }
    return state
  }

  const del = (stateName) => {
    const stateData = Object.entries(state).filter(([key]) => key === stateName)

    if (stateData === undefined) return
    if (event !== null) {
      event.emit('deleteData', (state[stateData[0]], stateName))
    }
    delete state[stateData[0]]
  }

  const destroy = () => {
    state = null
    if (event !== null) {
      event.emit('destroy', (state))
      event.removeAllListeners()
    }
  }
  stateData = new StateData({
    event,
    get,
    setState,
    postStructJson,
    del,
    destroy,
    modifyObject: (args) => modifyObject(args, stateData)
  })
  stateData.obj = state
  Object.assign(state, {
    ...stateData,
    useEffect: (...args) => stateData.useEffect(...args),
    setMessageID: (...args) => stateData.setMessageID(...args),
    setUserID: (...args) => stateData.setUserID(...args),
    setChannelID: (...args) => stateData.setChannelID(...args),
  })

  return state
}

/**
 * @template T
 * @prop {T}
 * @returns {T}
 */
export const createStateGeneric = () => null

/**
 * @extends {Array<{ id: string; time: number; variable: StateDataEffect<any>}>}
 */
export class ManageState extends Array {
  constructor() {
    super()
  }

  /**
   *
   * @param {StateDataEffect<any>} state
   */
  addState(state) {
    this.push({
      id: Math.floor(Math.random() * 100000000000000),
      time: Date.now() + MAX_TIME,
      variable: state
    })
  }

  getState(id) {
    return this.find((state) =>
      state.variable.messageID == id ||
      state.variable.channelID == id ||
      state.variable.userID == id ||
      state.variable.id == id) ?? null
  }

  delStates() {
    return this
      .filter((state) => (state.time - Date.now()) <= 0)
      .map((state, index) => {
        delete state.variable
        this.splice(this.findIndex((index) => index.id == state.id), 1)
        return index
      })
  }
}
