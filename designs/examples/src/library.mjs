import { rectangle } from '@freesewing/library'

export const rectBase = {
  name: 'examples.rectBase',
  draft: ({ store, part }) => {
    store.set('examples.rect1.width', 50)
    store.set('examples.rect1.height', 75)
    store.set('examples.rect2.width', 75)
    store.set('examples.rect2.height', 50)
    store.set('examples.rect3.width', 50)
    store.set('examples.rect3.height', 50)

    return part.hide()
  },
}

export const rect1 = {
  ...rectangle,
  name: 'examples.rect1',
  after: rectBase,
  options: { ...rectangle.options },
}

export const rect2 = {
  ...rectangle,
  name: 'examples.rect2',
  after: rectBase,
  options: { ...rectangle.options },
}

export const rect3 = {
  ...rectangle,
  name: 'examples.rect3',
  after: rectBase,
  options: {
    ...rectangle.options,
    examples_rect3_rectangleHeight: { ...rectangle.options.rectangleHeight },
  },
}
