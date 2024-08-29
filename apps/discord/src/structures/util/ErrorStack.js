import { resolve } from 'path'

const embed = (i, limit, s) => {
  const string = i.length > limit ? `${i.slice(0, limit)}...` : i
  return s ? string : i
}

export const removePath = (str, hidePath) => {
  const stack = str?.stack === undefined ? str : str.stack
  const path = resolve().replace(/\\/g, '/')
  const regexFile = RegExp(`${path}`, 'g')
  const getPath = stack
    .replace(/file:\/\/\//g, '')
    .replace(regexFile, '')

  return hidePath ? getPath : stack
}
const defineError = (str = Error('null'), limit, options) => {
  const stack = str?.stack != undefined ? str.stack : str
  const withLimite = (limit <= 0) ? false : true

  return !withLimite ? embed(stack.slice(0, limit, options.embed), limit) : stack
}

const defineErrorMessage = (str = Error('null'), limit, options) => {
  const stack = str?.message != undefined ? str.message : str.replace(/^([A-Za-z]+:.*)$|(\n.*at.*)/g, '')
  const withLimite = (limit <= 0) ? false : true

  return withLimite ? embed(stack.slice(0, limit, options.embed), limit) : stack
}

export const ErrorStack = (error, options = {
  hidePath: false,
  showMessageOnly: false,
  embed: false,
  /**
   *  -1 Disabled
   *  */
  limit: -1,
}) => {
  if (options.limit === undefined && options.limit === null) {
    options.limit = -1
  }
  if (options.showMessageOnly) {
    return defineErrorMessage(removePath(error, options.hidePath), options.limit, options)
  }

  return defineError(removePath(error, options.hidePath), options.limit, options)
}
