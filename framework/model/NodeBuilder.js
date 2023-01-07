/**
 * This structure is for working with settings that are not set or used to check settings. This will help a lot.
 * @returns 
 */
export const ModelNodeBuilder = () => ({
  developer: false,
  ipc: false,
  clustering: false,
  smart: false,
  debug: false,
  typescript: false,
  typescriptArgs: ['-D'],
  autoInstall: false,
})