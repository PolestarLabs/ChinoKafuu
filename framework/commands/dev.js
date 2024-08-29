import { defineArgs, defineCommand } from '../utils/defineCommand.js'



export const devCommand = defineCommand({
  name: '--dev',  
  description: 'Enable the name develop in the framework. This can enable debug logs.',
})