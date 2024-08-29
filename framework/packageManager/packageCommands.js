const yarnCommand = {
  install: {
    commandName: 'yarn install',
    commandArgs: {
      name: 'yarn',
      arg: 'install',
      args: ['install']
    },
  },
  dev: {
    commandName: 'yarn dev',
    commandArgs: {
      name: 'yarn',
      arg: 'dev',
      args: ['dev']
    },
  },
  add: {
    commandName: 'yarn add',
    commandArgs: {
      name: 'yarn',
      arg: 'add',
      args: ['add']
    },
  },
  run: {
    commandName: 'yarn start',
    commandArgs: {
      name: 'yarn',
      arg: 'start',
      args: ['start']
    },
  },
  test: {
    commandName: 'yarn test',
    commandArgs: {
      name: 'yarn',
      arg: 'test',
      args: ['test']
    },
  },
  upgrade: {
    commandName: 'yarn upgrade',
    commandArgs: {
      name: 'yarn',
      arg: 'upgrade',
      args: ['upgrade --force']
    },
  }
}


const npmCommand = {
  install: {
    commandName: 'npm install',
    commandArgs: {
      name: 'npm',
      arg: 'install',
      args: ['install -f']
    },
  },
  dev: {
    commandName: 'npm run dev',
    commandArgs: {
      name: 'npm',
      arg: 'run dev',
      args: ['run', 'dev']
    },
  },
  run: {
    commandName: 'npm run start',
    commandArgs: {
      name: 'npm',
      arg: 'run start',
      args: ['run', 'start']
    },
  },
  add: {
    commandName: 'npm install',
    commandArgs: {
      name: 'npm',
      arg: 'install',
      args: ['install']
    },
  },
  test: {
    commandName: 'npm run test',
    commandArgs: {
      name: 'npm',
      arg: 'ru test',
      args: ['run', 'test']
    },
  },
  upgrade: {
    commandName: 'npm update',
    commandArgs: {
      name: 'npm',
      arg: 'update',
      args: ['update']
    },
  }
}


const pnpmCommand = {
  install: {
    commandName: 'pnpm install',
    commandArgs: {
      name: 'pnpm',
      arg: 'install',
      args: ['install -f']
    },
  },
  dev: {
    commandName: 'pnpm run dev',
    commandArgs: {
      name: 'pnpm',
      arg: 'run dev',
      args: ['run', 'dev']
    },
  },
  run: {
    commandName: 'pnpm run start',
    commandArgs: {
      name: 'pnpm',
      arg: 'run start',
      args: ['run', 'start']
    },
  },
  add: {
    commandName: 'pnpm install',
    commandArgs: {
      name: 'pnpm',
      arg: 'install',
      args: ['install']
    },
  },
  test: {
    commandName: 'pnpm run test',
    commandArgs: {
      name: 'pnpm',
      arg: 'ru test',
      args: ['run', 'test']
    },
  },
  upgrade: {
    commandName: 'pnpm update',
    commandArgs: {
      name: 'pnpm',
      arg: 'update',
      args: ['update']
    },
  }
}



const bunCommand = {
  install: {
    commandName: 'bun install',
    commandArgs: {
      name: 'bun',
      arg: 'install',
      args: ['install']
    },
  },
  dev: {
    commandName: 'yarn dev:bun',
    commandArgs: {
      name: 'yarn',
      arg: 'dev:bun',
      args: ['dev:bun']
    },
  },
  run: {
    commandName: 'yarn start:bun',
    commandArgs: {
      name: 'yarn',
      arg: 'start:bun',
      args: ['start:bun']
    },
  },
  add: {
    commandName: 'yarn add',
    commandArgs: {
      name: 'yarn',
      arg: 'add',
      args: ['add']
    },
  },
  test: {
    commandName: 'yarn test:bun',
    commandArgs: {
      name: 'yarn',
      arg: 'test:bun',
      args: ['test:bun']
    },
  },
  upgrade: {
    commandName: 'yarn upgrade',
    commandArgs: {
      name: 'yarn',
      arg: 'upgrade',
      args: ['upgrade']
    },
  }
}

/**
 * It's a package manager selector for supported:
 * https://nodejs.org/api/corepack.html
 */
const selectPackageCommand = (packageManager = 'npm') => {
  if (packageManager === 'yarn' || packageManager === 'yarnpkg') {
    return yarnCommand
  } else if (packageManager === 'pnpm' || packageManager === 'pnpx') {
    return pnpmCommand
  } else if (packageManager === 'bun' || packageManager === 'bunPackageManager') {
    return bunCommand
  }

  return npmCommand
}

export {
  yarnCommand,
  pnpmCommand,
  npmCommand,
  selectPackageCommand,
  bunCommand
}

