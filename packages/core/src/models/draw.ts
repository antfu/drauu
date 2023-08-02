import type { Point } from '../types'
import { D, guid } from '../utils'
import { createArrowHead } from '../utils/dom'
import { simplify } from '../utils/simplify'
import { BaseModel } from './base'

export class DrawModel extends BaseModel<SVGPathElement> {
  public points: Point[] = []
  private count = 0
  private arrowId: string | undefined

  override onStart(point: Point) {
    this.el = this.createElement('path', { fill: 'transparent' })
    this.points = [point]

    if (this.brush.arrowEnd) {
      this.arrowId = guid()
      const head = createArrowHead(this.arrowId, this.brush.color)
      this.el.appendChild(head)
    }

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      this.onStart(point)

    if (this.points[this.points.length - 1] !== point) {
      this.points.push(point)
      this.count += 1
    }

    // when using pressure, we need to divide the path intro multiple segments
    // to have different size and weight in each part
    if (this.count > 5) {
      this.points = simplify(this.points, 1, true)
      this.count = 0
    }

    this.attr('d', DrawModel.toSvgData(this.points))
    return true
  }

  override onEnd() {
    const path = this.el
    this.el = null

    if (!path)
      return false

    path.setAttribute('d', DrawModel.toSvgData(simplify(this.points, 1, true)))

    if (!path.getTotalLength())
      return false

    return true
  }

  // https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
  static line(a: Point, b: Point) {
    const lengthX = b.x - a.x
    const lengthY = b.y - a.y
    return {
      length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
      angle: Math.atan2(lengthY, lengthX),
    }
  }

  static controlPoint(current: Point, previous: Point, next?: Point, reverse?: boolean) {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
    const p = previous || current
    const n = next || current
    // The smoothing ratio
    const smoothing = 0.2
    // Properties of the opposed-line
    const o = DrawModel.line(p, n)
    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing
    // The control point position is relative to the current point
    const x = current.x + Math.cos(angle) * length
    const y = current.y + Math.sin(angle) * length
    return { x, y }
  }

  static bezierCommand(point: Point, i: number, points: Point[]) {
  // start control point
    const cps = DrawModel.controlPoint(points[i - 1], points[i - 2], point)
    // end control point
    const cpe = DrawModel.controlPoint(point, points[i - 1], points[i + 1], true)
    return `C ${cps.x.toFixed(D)},${cps.y.toFixed(D)} ${cpe.x.toFixed(D)},${cpe.y.toFixed(D)} ${point.x.toFixed(D)},${point.y.toFixed(D)}`
  }

  static toSvgData(points: Point[]) {
    return points.reduce((acc, point, i, a) =>
      i === 0
        ? `M ${point.x.toFixed(D)},${point.y.toFixed(D)}`
        : `${acc} ${DrawModel.bezierCommand(point, i, a)}`
    , '')
  }
}
