import { ModelNodeBuilder } from './NodeBuilder.js'

// Using this structure to check the JSON configuration options.
export const ModelNodeResolver = function (
  model = ModelNodeBuilder(),
  path
) {
  if (typeof model.autoInstall != 'boolean') throw Error(`Error Repository ${path}: autoInstall entered incorrectly. This must be boolean.`)
  if (typeof model.debug != 'boolean') throw Error(`Error Repository ${path}: Debug Mode entered incorrectly. This must be boolean.`)
  if (typeof model.developer != 'boolean') throw Error(`Error Repository ${path}: Developer mode entered incorrectly. This must be boolean.`)
  if (typeof model.typescript != 'boolean') throw Error(`Error Repository ${path}: Typescript Compiler entered incorrectly. This must be boolean.`)


  return true
}