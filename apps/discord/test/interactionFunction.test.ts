import { defineInteraction } from '../src/structures/InteractionFunction'


describe('interaction test', () => {
  test('definition interaction', () => {
    expect(defineInteraction({
      name: 'test',
      customMessage: {
        'error': 'test'
      },
      timeoutInteraction: 90
    })).toStrictEqual({
      name: 'test',
      customMessage: {
        'error': 'test'
      },
      autoComplete: false,
      timeoutInteraction: 10000
    })
  })
})

