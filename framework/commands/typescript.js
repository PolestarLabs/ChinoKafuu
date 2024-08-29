import { defineCommand, supportedState } from '../utils/defineCommand.js'



export const typescriptCommand = defineCommand({
  name: '--no-ts',
  description: 'When using this command, the framework may not run the repository written in Typescript.',
  supports: [
    supportedState({
      name: 'Typescript',
      description: 'When using this command, you can lose the function of running typescript code in a Typescript written repository.'
    }),
  ]
})