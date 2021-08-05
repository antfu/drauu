import { Point } from '../types'
import { numSort } from '../utils'
import { BaseModel } from './base'

export class RectModel extends BaseModel<SVGRectElement> {
  override onStart(point: Point) {
    this.el = this.createElement('rect')

    if (this.brush.rectangle?.radius) {
      this.attr('rx', this.brush.rectangle.radius)
      this.attr('ry', this.brush.rectangle.radius)
    }

    this.attr('x', point.x)
    this.attr('y', point.y)

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return false

    const [x1, x2] = [this.start.x, point.x].sort(numSort)
    const [y1, y2] = [this.start.y, point.y].sort(numSort)

    let dx = x2 - x1
    let dy = y2 - y1

    if (this.shiftPressed) {
      const d = Math.min(dx, dy)
      dx = d
      dy = d
    }

    this.attr('x', x1)
    this.attr('y', y1)
    this.attr('width', dx)
    this.attr('height', dy)

    return true
  }

  override onEnd() {
    const path = this.el
    this.start = null
    this.el = null

    if (!path)
      return false
    if (!path.getTotalLength())
      return false
    return true
  }
}
