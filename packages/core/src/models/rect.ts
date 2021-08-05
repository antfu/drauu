import { Point } from '../types'
import { numSort } from '../utils'
import { BaseModel } from './base'

export class RectModel extends BaseModel {
  private rect: SVGRectElement | null = null
  private startPoint: Point | null = null

  override onStart(point: Point) {
    this.rect = this.createElement('rect')

    this.startPoint = point

    if (this.brush.rectangle?.radius) {
      this.rect.setAttribute('rx', this.brush.rectangle.radius.toString())
      this.rect.setAttribute('ry', this.brush.rectangle.radius.toString())
    }

    this.rect.setAttribute('x', point.x.toString())
    this.rect.setAttribute('y', point.y.toString())

    return this.rect
  }

  override onMove(point: Point) {
    if (!this.rect || !this.startPoint)
      return false

    const [x1, x2] = [this.startPoint.x, point.x].sort(numSort)
    const [y1, y2] = [this.startPoint.y, point.y].sort(numSort)

    let dx = x2 - x1
    let dy = y2 - y1

    if (this.shiftPressed) {
      const d = Math.min(dx, dy)
      dx = d
      dy = d
    }

    this.rect.setAttribute('x', x1.toString())
    this.rect.setAttribute('y', y1.toString())
    this.rect.setAttribute('width', dx.toString())
    this.rect.setAttribute('height', dy.toString())

    return true
  }

  override onEnd() {
    const path = this.rect
    this.startPoint = null
    this.rect = null

    if (!path)
      return false
    if (!path.getTotalLength())
      return false
    return true
  }
}
