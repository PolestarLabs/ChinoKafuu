import { defineArgs, defineCommand } from '../utils/defineCommand.js'



export const clearLogCommand = defineCommand({
  name: '--clear-log',
  description: 'Clear recent logs and focus the window to get a better view of the logs.',
})