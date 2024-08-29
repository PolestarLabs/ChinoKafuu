// Set of useful functions to facilitate testing
import { lstatSync, readdirSync } from 'fs'
import { resolve } from 'path'

//@ts-ignore
String.prototype.isUpperCase = function (index: any = 0) {
  return this[typeof index === 'number' ? 0 : index].toUpperCase() === this[typeof index === 'number' ? 0 : index].toUpperCase()
}

//@ts-ignore
String.prototype.isLowerCase = function () {
  return this === this.toLocaleLowerCase()
}

//@ts-ignore
String.prototype.getAt = function (splitter: any, index: any) {
  return this.split(splitter)[index === -1 ? this.split(splitter).length - 1 : index]
}

const getAllFilesRecursive = (path) => {
  const list = []
  const rec = (patht) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    readdirSync(patht.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)|(\\test\/)/g, '')).forEach((df) => {
      const fp = `${patht.replace(/(\\test\/)|(test\/)|(\\test)/g, '')}/${df.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)|(\\test\/)/g, '')}`
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (lstatSync(fp).isDirectory()) return rec(fp)
      list.push(fp)
    })
  }
  rec(path)
  return list
}

const loadClassesRecursive = (path) => {
  getAllFilesRecursive(path.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)/g, '')).forEach((df) => {
    // eslint-disable-next-line security/detect-non-literal-require
    const C = require(df)
    const resolveC = C.default != undefined ? C.default : C
    new resolveC()
  })
}


const loadCommands = () => {
  const modules = []
  const open = async (path = resolve(__dirname.replace(/\\test|\/test/g, '') + '/src/commands/slash')) => {
    const dir = readdirSync(path)
    for (const modulePath of dir) {
      if (modulePath.endsWith('.js')) {
        const module = require(path + `/${modulePath}`)
        const C = module.default != undefined ? module.default : module
        modules.push(C)

      } else {
        open(resolve(path + `/${modulePath}`))
      }
    }
  }

  open()
  return modules
}


const checkCommand = (Command) => {
  const commandBlock = new Command()
  if (typeof commandBlock.name !== 'string') {
    throw new Error(`Command.name is ${commandBlock.name}`)
  }
  if (!commandBlock.name.isLowerCase()) {
    throw new Error(`The "${Command.name}" command in the "name" (${commandBlock.name}) field must have all lowercase letters.`)
  }
  if (commandBlock.aliases !== undefined && commandBlock.slashCommand !== undefined) {
    throw new Error(`Command.aliases is deprecated.`)
  }

  return true
}
export { loadClassesRecursive, getAllFilesRecursive, loadCommands, checkCommand }

