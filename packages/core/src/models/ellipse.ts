import { Point } from '../types'
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

    let dx = Math.abs(point.x - this.start.x)
    let dy = Math.abs(point.y - this.start.y)

    if (this.shiftPressed) {
      const d = Math.min(dx, dy)
      dx = d
      dy = d
    }

    this.attr('rx', dx)
    this.attr('ry', dy)

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
