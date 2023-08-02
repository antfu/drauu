import type { Point } from '../types'
import { numSort, splitNum } from '../utils'
import { BaseModel } from './base'

export class EllipseModel extends BaseModel<SVGEllipseElement> {
  override onStart(point: Point) {
    this.el = this.createElement('ellipse')

    this.attr('cx', point.x)
    this.attr('cy', point.y)

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
      this.attr('cx', this.start.x)
      this.attr('cy', this.start.y)
      this.attr('rx', dx)
      this.attr('ry', dy)
    }
    else {
      const [x1, x2] = [this.start.x, this.start.x + dx * sx].sort(numSort)
      const [y1, y2] = [this.start.y, this.start.y + dy * sy].sort(numSort)

      this.attr('cx', (x1 + x2) / 2)
      this.attr('cy', (y1 + y2) / 2)
      this.attr('rx', (x2 - x1) / 2)
      this.attr('ry', (y2 - y1) / 2)
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
