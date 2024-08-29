/* eslint-disable no-unused-vars */
import { isAsyncFunction } from 'util/types'
// eslint-disable-next-line import/named
import { StateDataEffect, defineState } from '../defineTypes/defineState'
import { InteractionContext } from './InteractionContext'
const defineStateDefault = defineState({ default: false })

/**
 * @template S
 * @typedef TypeDefineInteractionState
 * @type {defineInteractionFunction<S>}
 *
 */

/**
 * @template T
 * @typedef {object} defineOptionsCtx
 * @property {InteractionContext['createMessageInteraction']} createMessageInteraction
 * @property {InteractionContext['editMessageInteraction']} editMessageInteraction
 * @property {InteractionContext['editT']} editT
 * @property {InteractionContext['editMessage']} editMessage
 * @property {InteractionContext['editMessageT']} editMessageT
 * @property {InteractionContext['editInteraction']} editInteraction
 * @property {InteractionContext['edit']} edit
 * @property {InteractionContext['getUserInteraction']} getUserInteraction
 * @property {InteractionContext['reply']} reply
 * @property {InteractionContext['replyT']} replyT
 * @property {InteractionContext['send']} send
 * @property {InteractionContext['sendT']} sendT
 * @property {InteractionContext['useModal']} useModal
 * @property {InteractionContext['userGetsInteractionAccess']} userGetsInteractionAccess
 * @property {InteractionContext['getState']} getState
 * @property {InteractionContext['deleteInteraction']} deleteInteraction
 * @property {InteractionContext['sendEmbedPage']} sendEmbedPage
 * @property {(args: 'commands:' | 'basic:' | 'events:' | 'permission:' | 'slashcommand:', placeholder: Object.<number, string | 'Text example.'>) => string} _locale
 * @property {InteractionContext['getData']} getData
 * @property {InteractionContext['getArg']} getArg
 * @property {InteractionContext} ctx
 * @property {(func?: (var: StateDataEffect<T>), variable?: keyof StateDataEffect<T>) => StateDataEffect<T> | null} useState
 * @property {InteractionContext['trackingCommand']} trackingCommand
 * @property {StateDataEffect<T>} defineState
 */
/**
 * @template T
 * @typedef {object} defineOptionsInterface
 * @property {InteractionContext['createMessageInteraction']} createMessageInteraction
 * @property {InteractionContext['editMessageInteraction']} editMessageInteraction
 * @property {InteractionContext['editT']} editT
 * @property {InteractionContext['editMessage']} editMessage
 * @property {InteractionContext['editMessageT']} editMessageT
 * @property {InteractionContext['editInteraction']} editInteraction
 * @property {InteractionContext['edit']} edit
 * @property {InteractionContext['getUserInteraction']} getUserInteraction
 * @property {InteractionContext['reply']} reply
 * @property {InteractionContext['replyT']} replyT
 * @property {InteractionContext['send']} send
 * @property {InteractionContext['sendT']} sendT
 * @property {InteractionContext['useModal']} useModal
 * @property {InteractionContext['userGetsInteractionAccess']} userGetsInteractionAccess
 * @property {InteractionContext['getState']} getState
 * @property {InteractionContext['deleteInteraction']} deleteInteraction
 * @property {InteractionContext['sendEmbedPage']} sendEmbedPage
 * @property {(args: 'commands:' | 'basic:' | 'events:' | 'permission:' | 'slashcommand:', placeholder: Object.<number, string | 'Text example.'>) => string} _locale
 * @property {InteractionContext['getData']} getData
 * @property {InteractionContext['getArg']} getArg
 * @property {InteractionContext} ctx
 * @property {(func: (variable: T, cache: { newCache: StateDataEffect<T>; oldCache: StateDataEffect<T> })
 *  => StateDataEffect<T>, options: { timeout?: number; }) => StateDataEffect<T>} useState
 * @property {InteractionContext['trackingCommand']} trackingCommand
 * @property {StateDataEffect<T>} defineState
 * @property {async () => void} once
 */

const genErr = (err, { isAsync = false }) => {
  if (err instanceof Error) {

    const message = err.stack.split('\n')
    message.push(`isAsync: "${isAsync}"`)
    return `\n${message.join('\n')}`
  }

  return err
}
const regexPath = new RegExp(/node_modules(\/+|\\+)jest-worker(\/+|\\+)build(\/+|\\+)workers(\/+|\\+)processChild\.js/)
const IS_ENVIRONMENT_JEST =
  typeof process.argv.find((arg, index) => regexPath.test(arg) && index == 1) === 'string'
  || typeof process.env?.JEST_WORKER_ID === 'string'
/**
 *  This type of interaction function definition is used to reduce workload and make it a single and asynchronous (or non-asynchronous) function.
 *  @template S
 *  @param {(T: defineOptionsInterface<S>, stateTemplate?: S) => void} interactionDefault
 *  @param {S} _
 *  ```js
 *  import { defineInteractionFunction } from './InteractionFunction'
 *
 *  export default defineInteractionFunction(({...options}) => {
 *      /// ...code
 *  })
 *  ```
 */
export const defineInteractionFunction = async (interactionDefault, _ = null) => {
  if (_ != null) {
    _ = null
  }
  return async (args, _ = null) => {
    if (_ != null) {
      _ = null
    }
    return new Promise((resolve, reject) => {
      const defaultFunc = {
        isAsync: isAsyncFunction(interactionDefault),
        fn: interactionDefault,
        args: []
      }
      if (defaultFunc.isAsync) {
        defaultFunc.fn(args).catch((err) => { throw genErr(err, { isAsync: true }) })
        resolve(true)
      } else {
        try {
          defaultFunc.fn(args)
          resolve(true)
        } catch (err) {
          throw genErr(err, { isAsync: false })
        }
      }

    })
  }
}

/**
 * @typedef {{
 *   name?: string;
 *   customMessage?: {
 *      'userLimited'?: string | null;
 *      'userBanned'?: string | null;
 *      'error'?: string | null;
 *      'timeout'?: 'string | null';
 *  };
 *  autoComplete?: boolean;
 *  typeInteraction?: Array.<'button' | 'selectionMenu' | 'modal'> | 'button' | 'selectionMenu' | 'modal' | ['button', 'selectionMenu', 'modal', 'any', 'selectMenus']
 *  timeoutInteraction?: number | null | undefined;
 * }} interactionOptionsTypeDef
 */

/**
 * @template T, R
 * @param {defineInteraction} T
 * @param {defineInteractionFunction} R
 */
export const defineInteractionDefault = (T, R) => {

  const obj = ({
    mode: 'define',
    T: T instanceof Object ? T : (() => { throw new Error('') }),
    R: async (args) => (await R)(args),
    typeInteraction: () => T instanceof Object ?
      T.typeInteraction()
      : (() => { throw new Error('Error: Fail to execute: defineInteractionDefault().obj().typeInteraction was broked!') })
  })

  // To make the code safer, let's avoid modifying property names.
  Object.defineProperty(obj, 'mode', { writable: false })
  Object.defineProperty(obj, 'T', { writable: false })
  Object.defineProperty(obj, 'R', { writable: false })
  Object.defineProperty(obj, 'typeInteraction', { writable: false })

  return obj
}

/**
 * If you want to reduce the excessive use of classes, you can use defineInteraction and defineInteractionFunction to define the file as an interaction function.
 * @param {interactionOptionsTypeDef} interactionOptions
 * @returns {interactionOptionsTypeDef}
 */
export const defineInteraction = ({ name, customMessage, autoComplete, timeoutInteraction, typeInteraction }) => ({
  interactionName: typeof name === 'string' ? name : (() => { throw Error(`Field of name is string: (${typeof name}) - ${name}`) })(),
  typeInteraction:
    IS_ENVIRONMENT_JEST ? typeof typeInteraction === 'string' ? [typeInteraction] : ['button', 'selectionMenu', 'modal', 'any', 'selectMenus'] : (
      () => Array.isArray(typeInteraction) ?
        [] : typeof typeInteraction === 'string' ? [typeInteraction] : ['button', 'selectionMenu', 'modal', 'any', 'selectMenus'] /* ANY */),
  customMessage: Object.is(customMessage) ? {} : customMessage,
  autoComplete: typeof autoComplete === 'boolean' ? autoComplete : false,
  timeoutInteraction: typeof timeoutInteraction === 'number' ? timeoutInteraction : null
})

export class InteractionFunction {
  constructor(options = { name: undefined, customMessage: {}, autoComplete: false, timeoutInteraction: undefined },) {

    this.interactionName = options.name || null
    this.customMessage = {
      ...options.customMessage
    }

    this.autoComplete = options.autoComplete || false
    this.timeoutInteraction = options.timeoutInteraction || null
  }

  typeInteraction() {
    return []
  }

  interactionFunction() { }

  once() { }

  destroyInteraction() {
    return null
  }
}