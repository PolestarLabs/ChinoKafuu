import { readFileSync } from 'fs'

export const loadConfiguration = (path = '') => {
  if (path === null && typeof path !== 'string') throw Error('Ahnoo!! Not this again. Unable to load settings.')
  if (!path.endsWith('.json')) throw Error('This doesn\'t appear to be a JSON :(')


  const file = readFileSync(path)

  return JSON.parse(file)
}