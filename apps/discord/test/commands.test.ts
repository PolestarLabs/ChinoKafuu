// These comments will be removed, I'm preparing a new test.
//
/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/require-top-level-describe */
/* eslint-disable jest/prefer-expect-assertions */
import * as util from './test-utils'
test('commands', () => {
  expect(() => {
    util.getAllFilesRecursive(`${__dirname.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)/g, '')}/src/commands`).forEach(c => {
      //@ts-ignore
      const hm = c.getAt('/', -1)
      if (!hm.endsWith('Command.js') || !hm.isUpperCase(0)) throw new Error(`${c} doesn't following naming rule! Use CommandName (uppercased) *and* the suffix Command.js`)
      // eslint-disable-next-line security/detect-non-literal-require
      const resolveImport = require(c)
      const resolveCommand = resolveImport.default != undefined ? resolveImport.default : resolveImport
      const Command = new (resolveCommand)()

      if (Command.test !== undefined && typeof Command.test === 'function') {
        // eslint-disable-next-line no-useless-catch
        try {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(() => Command.test()).toBeDefined()
        } catch (err) {
          throw err
        }
      }
    })
  }).not.toThrow()
})

test('all commands can be properly required and initializated', () => {
  expect(() => util.loadClassesRecursive(`${__dirname.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)/g, '')}/src/commands`))
    .not.toThrow()
})
test('all commands follow proper naming rules (CommandName and suffix -Command.js)', () => {
  expect(() => {
    util.getAllFilesRecursive(`${__dirname.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)/g, '')}/src/commands`).forEach(c => {
      //@ts-ignore
      const hm = c.getAt('/', -1)
      if (!hm.endsWith('Command.js') || !hm.isUpperCase(0)) throw new Error(`${c} doesn't following naming rule! Use CommandName (uppercased) *and* the suffix Command.js`)

      // eslint-disable-next-line security/detect-non-literal-require

    })
  }).not.toThrow()
})

