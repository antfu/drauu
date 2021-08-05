import { Point } from '../types'
import { BaseModel } from './base'

export class LineModel extends BaseModel {
  private line: SVGLineElement | null = null

  override onStart(point: Point) {
    this.line = this.createElement('line')

    this.line.setAttribute('x1', point.x.toString())
    this.line.setAttribute('y1', point.y.toString())
    this.line.setAttribute('x2', point.x.toString())
    this.line.setAttribute('y2', point.y.toString())

    return this.line
  }

  override onMove(point: Point) {
    if (!this.line)
      return false

    this.line.setAttribute('x2', point.x.toString())
    this.line.setAttribute('y2', point.y.toString())

    return true
  }

  override onEnd() {
    const path = this.line
    this.line = null

    if (!path)
      return false
    if (!path.getTotalLength())
      return false

    return true
  }
}
