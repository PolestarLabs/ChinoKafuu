import { defineArgs, defineCommand } from '../utils/defineCommand.js'



export const upgradePackagesCommand = defineCommand({
  name: '--upgrade-packages',
  description: 'Update recent packages in all repositories.',
})