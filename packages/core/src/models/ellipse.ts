import { Point } from '../types'
import { BaseModel } from './base'

export class EllipseModel extends BaseModel {
  private ellipse: SVGEllipseElement | null = null
  private startPoint: Point | null = null

  override onStart(point: Point) {
    this.ellipse = this.createElement('ellipse')

    this.startPoint = point

    this.ellipse.setAttribute('cx', point.x.toString())
    this.ellipse.setAttribute('cy', point.y.toString())

    return this.ellipse
  }

  override onMove(point: Point) {
    if (!this.ellipse || !this.startPoint)
      return false

    let dx = Math.abs(point.x - this.startPoint.x)
    let dy = Math.abs(point.y - this.startPoint.y)

    if (this.shiftPressed) {
      const d = Math.min(dx, dy)
      dx = d
      dy = d
    }

    this.ellipse.setAttribute('rx', dx.toString())
    this.ellipse.setAttribute('ry', dy.toString())

    return true
  }

  override onEnd() {
    const path = this.ellipse
    this.startPoint = null
    this.ellipse = null

    if (!path)
      return false
    if (!path.getTotalLength())
      return false
    return true
  }
}
