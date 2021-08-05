import { Point } from '../types'
import { BaseModel } from './base'

export class LineModel extends BaseModel<SVGLineElement> {
  override onStart(point: Point) {
    this.el = this.createElement('line')

    this.attr('x1', point.x)
    this.attr('y1', point.y)
    this.attr('x2', point.x)
    this.attr('y2', point.y)

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      return false

    this.attr('x2', point.x)
    this.attr('y2', point.y)

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
