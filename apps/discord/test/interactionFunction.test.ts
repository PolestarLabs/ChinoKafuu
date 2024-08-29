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
      interactionName: 'test',
      customMessage: {
        'error': 'test'
      },
      typeInteraction: ['button', 'selectionMenu', 'modal', 'any', 'selectMenus'],
      autoComplete: false,
      timeoutInteraction: 90
    })
  })
})

