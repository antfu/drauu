import type { Point } from '../types'
import { numSort, splitNum } from '../utils'
import { BaseModel } from './base'

export class RectModel extends BaseModel<SVGRectElement> {
  override onStart(point: Point) {
    this.el = this.createElement('rect')

    if (this.brush.cornerRadius) {
      this.attr('rx', this.brush.cornerRadius)
      this.attr('ry', this.brush.cornerRadius)
    }

    this.attr('x', point.x)
    this.attr('y', point.y)

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return false

    let [dx, sx] = splitNum(point.x - this.start.x)

    let [dy, sy] = splitNum(point.y - this.start.y)

    if (this.shiftPressed) {
      const d = Math.min(dx, dy)
      dx = d
      dy = d
    }

    if (this.altPressed) {
      this.attr('x', this.start.x - dx)
      this.attr('y', this.start.y - dy)
      this.attr('width', dx * 2)
      this.attr('height', dy * 2)
    }
    else {
      const [x1, x2] = [this.start.x, this.start.x + dx * sx].sort(numSort)
      const [y1, y2] = [this.start.y, this.start.y + dy * sy].sort(numSort)

      this.attr('x', x1)
      this.attr('y', y1)
      this.attr('width', x2 - x1)
      this.attr('height', y2 - y1)
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
