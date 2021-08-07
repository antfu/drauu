import { Point } from '../types'
import { BaseModel } from './base'

export class LineModel extends BaseModel<SVGLineElement> {
  override onStart(point: Point) {
    this.el = this.createElement('line', { fill: 'transparent' })

    this.attr('x1', point.x)
    this.attr('y1', point.y)
    this.attr('x2', point.x)
    this.attr('y2', point.y)

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      return false

    let { x, y } = point

    if (this.shiftPressed) {
      const dx = point.x - this.start.x
      const dy = point.y - this.start.y
      if (dy !== 0) {
        let slope = dx / dy
        slope = Math.round(slope)
        if (Math.abs(slope) <= 1) {
          x = this.start.x + dy * slope
          y = this.start.y + dy
        }
        else {
          x = this.start.x + dx
          y = this.start.y
        }
      }
    }

    if (this.altPressed) {
      this.attr('x1', this.start.x * 2 - x)
      this.attr('y1', this.start.y * 2 - y)
      this.attr('x2', x)
      this.attr('y2', y)
    }
    else {
      this.attr('x1', this.start.x)
      this.attr('y1', this.start.y)
      this.attr('x2', x)
      this.attr('y2', y)
    }

    return true
  }

  override onEnd() {
    const path = this.el
    this.el = null

    if (!path)
      return false
    if (!path.getTotalLength())
      return false

    return true
  }
}
