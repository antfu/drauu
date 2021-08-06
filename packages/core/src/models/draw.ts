import { Point } from '../types'
import { BaseModel } from './base'

export class DrawModel extends BaseModel<SVGPathElement> {
  private points: Point[] = []

  override onStart(point: Point) {
    this.el = this.createElement('path')
    this.points = [point]

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      return false

    if (this.points[this.points.length - 1] !== point)
      this.points.push(point)

    this.el!.setAttribute('d', toSvgData(this.points))
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

// https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
function line(a: Point, b: Point) {
  const lengthX = b.x - a.x
  const lengthY = b.y - a.y
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  }
}

function controlPoint(current: Point, previous: Point, next?: Point, reverse?: boolean) {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current.x + Math.cos(angle) * length
  const y = current.y + Math.sin(angle) * length
  return { x, y }
}

function bezierCommand(point: Point, i: number, points: Point[]) {
  // start control point
  const cps = controlPoint(points[i - 1], points[i - 2], point)
  // end control point
  const cpe = controlPoint(point, points[i - 1], points[i + 1], true)
  return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`
}

function toSvgData(points: Point[]) {
  return points.reduce((acc, point, i, a) =>
    i === 0
      ? `M ${point.x},${point.y}`
      : `${acc} ${bezierCommand(point, i, a)}`
  , '')
}
