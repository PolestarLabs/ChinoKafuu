import { defineArgs, defineCommand } from '../utils/defineCommand.js'



export const testCommand = defineCommand({
  name: 'yarn test',
  description: 'Start testing with Jest and with the help of Babel.',
})