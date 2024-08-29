import { defineCommand } from '../utils/defineCommand.js'



export const watchServerCommand = defineCommand({
  name: '--watch-server',
  description: 'Enable server to watch repository structure.',
})