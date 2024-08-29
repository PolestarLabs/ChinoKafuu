// These comments will be removed, I'm preparing a new test.
//
/* eslint-disable jest/require-top-level-describe */
/* eslint-disable jest/prefer-expect-assertions */
import {
  loadClassesRecursive
} from './test-utils'

test('all listeners can be properly required and initializated', () => {
  expect(() => loadClassesRecursive(`${__dirname.replace(/(\\test\/)|(test\/)|(\\test)|(\\test\/)/g, '')}/src/listeners`))
    .not.toThrow()
})