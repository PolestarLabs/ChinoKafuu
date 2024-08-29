import { defineCommand, supportedState } from '../utils/defineCommand.js'



export const forceInstallCommand = defineCommand({
  name: 'yarn start --force-install',
  description: 'Force install to all repositories.',
  supports: [
    supportedState({
      name: 'Bun',
      description: 'Bun is going to use installed packages in Yarn, some packages are not supported yet.'
    }),
  ]
})