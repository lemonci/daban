import about from '../about.json' with { type: 'json' }
import { capitalize } from '@freesewing/core'

const scalePoint = (p, x, y, c) => {
  p.x = (p.x - c.x) * x + c.x
  p.y = (p.y - c.y) * y + c.y
  return p
}

export const plugin = {
  name: about.id,
  version: about.version,
  macros: {
    transform: function ({
      transform = Object.freeze({ rotate: 'rotate', translate: 'translate', scale: 'scale' }),
      x = 0,
      y,
      angle = 0,
      c = new this.Point(0, 0),
      clone = true,
      points = [],
      paths = [],
      prefix = 'transformed',
    }) {
      if (y === undefined) y = x

      for (const pathId of paths) {
        // Make sure the path exists
        if (this.paths[pathId]) {
          const path = clone ? this.paths[pathId].clone() : this.paths[pathId]

          const newId = clone
            ? typeof prefix == 'function'
              ? prefix(pathId, 'path')
              : `${prefix}${capitalize(pathId)}`
            : pathId

          switch (transform) {
            case 'rotate':
              this.paths[newId] = path.rotate(angle, c)
              break
            case 'translate':
              this.paths[newId] = path.translate(x, y)
              break
            case 'scale':
              for (const op of path.ops) {
                switch (op.type) {
                  case 'curve':
                    op.cp1 = scalePoint(op.cp1, x, y, c)
                    op.cp2 = scalePoint(op.cp2, x, y, c)
                  case 'move':
                  case 'line':
                    op.to = scalePoint(op.to, x, y, c)
                }
              }
              this.paths[newId] = path
          }
        }
      }

      for (const pointId of points) {
        // Make sure the point exists
        if (this.points[pointId]) {
          const point = clone ? this.points[pointId].clone() : this.points[pointId]

          const newId = clone
            ? typeof prefix == 'function'
              ? prefix(pointId, 'point')
              : `${prefix}${capitalize(pointId)}`
            : pointId

          switch (transform) {
            case 'rotate':
              this.points[newId] = point.rotate(angle, c)
              break
            case 'translate':
              this.points[newId] = point.translate(x, y)
              break
            case 'scale':
              this.points[newId] = scalePoint(point, x, y, c)
              break
          }
        }
      }
    },
  },
}

// More specifically named exports
export const transformPlugin = plugin
export const pluginTransform = plugin
