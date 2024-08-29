import { defineCommand, supportedState } from '../utils/defineCommand.js'



export const installPackageCommand = defineCommand({
  name: 'yarn installPackage [...packages]',
  description: 'Install packages from the Repository. (At the moment it\'s only working on @chinokafuu/discord).',
  supports: [
    supportedState({
      name: 'Bun',
      description: 'Bun is going to use installed packages in Yarn, some packages are not supported yet.'
    }),
  ]
})