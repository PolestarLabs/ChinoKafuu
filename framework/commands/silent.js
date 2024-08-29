import { defineCommand, supportedState } from '../utils/defineCommand.js'



export const silentCommand = defineCommand({
  name: '--silent',
  description: 'Disable logs like info, debug, trace. Just leaving: warn, error. For important things.',
  supports: [
    supportedState({
      name: 'Bun',
      description: 'Bun is going to use installed packages in Yarn, some packages are not supported yet.'
    }),
  ]
})