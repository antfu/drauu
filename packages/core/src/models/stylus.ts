import * as pf from 'perfect-freehand'
import type { Brush, Point } from '../types'
import { BaseModel } from './base'

export class StylusModel extends BaseModel<SVGPathElement> {
  public points: Point[] = []

  override onStart(point: Point) {
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    this.points = [point]

    this.attr('fill', this.brush.color)
    this.attr('d', this.getSvgData(this.points))

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      this.onStart(point)

    if (this.points[this.points.length - 1] !== point)
      this.points.push(point)

    this.attr('d', this.getSvgData(this.points))
    return true
  }

  override onEnd() {
    const path = this.el
    this.el = null

    if (!path)
      return false
    return true
  }

  getSvgData(points: Point[]) {
    return StylusModel.getSvgData(points, this.brush)
  }

  static getSvgData(points: Point[], brush: Brush) {
    const stroke = pf.getStroke(points, {
      size: brush.size,
      thinning: 0.9,
      simulatePressure: false,
      start: {
        taper: 5,
      },
      end: {
        taper: 5,
      },
      ...brush.stylusOptions,
    })

    if (!stroke.length)
      return ''

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ['M', ...stroke[0], 'Q'],
    )

    d.push('Z')
    return d.map(i => typeof i === 'number' ? i.toFixed(2) : i).join(' ')
  }
}
