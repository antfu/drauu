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

    this.ellipse.setAttribute('rx', Math.abs(point.x - this.startPoint.x).toString())
    this.ellipse.setAttribute('ry', Math.abs(point.y - this.startPoint.y).toString())

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
