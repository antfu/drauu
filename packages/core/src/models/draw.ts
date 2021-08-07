import { Point } from '../types'
import { D } from '../utils'
import { simplify } from '../utils/simpify'
import { BaseModel } from './base'

const SEGMENT_LENGTH = 4

export class DrawModel extends BaseModel<SVGGElement | SVGPathElement> {
  private points: Point[] = []
  private index = 0
  private count = 0

  override onStart(point: Point) {
    this.el = this.pressure
      ? this.createElement('g')
      : this.createElement('path')

    this.points = [point]
    this.index = 0

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      return false

    if (this.points[this.points.length - 1] !== point) {
      this.points.push(point)
      this.count += 1
    }

    // when using pressure, we need to divide the path intro multiple segments
    // to have different size and weight in each part
    if (this.pressure) {
      while (this.points.length - this.index >= SEGMENT_LENGTH) {
        const seg = this.createElement('path')
        const points = this.points.slice(this.index, this.index + SEGMENT_LENGTH)
        const pressure = points
          .map(i => i.force)
          .filter(i => i != null)
          .reduce((a: number, b) => a + b!, 0) / SEGMENT_LENGTH

        seg.setAttribute('d', toSvgData(points))
        seg.setAttribute('stroke-width', (this.brush.size * pressure * 2).toString())
        // seg.style.setProperty('opacity', Math.min(1, pressure * 2.5).toString())
        this.el.appendChild(seg)
        this.index += Math.round(SEGMENT_LENGTH / 2)
      }
    }
    // when not using pressure, we just draw the path
    else {
      if (this.simplify && this.count > 5) {
        this.points = simplify(this.points, 1, true)
        this.count = 0
      }

      this.attr('d' as any, toSvgData(this.points))
    }
    return true
  }

  override onEnd() {
    if (!this.pressure && this.simplify)
      this.attr('d' as any, toSvgData(simplify(this.points, 1, true)))

    const path = this.el
    this.el = null

    if (!path)
      return false
    if (this.pressure && !path?.children.length)
      return false
    if (!this.pressure && !(path as SVGPathElement).getTotalLength())
      return false

    return true
  }

  get pressure() {
    return !!this.brush.pressure
  }

  get simplify() {
    return !!this.brush.simplify
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
  return `C ${cps.x.toFixed(D)},${cps.y.toFixed(D)} ${cpe.x.toFixed(D)},${cpe.y.toFixed(D)} ${point.x.toFixed(D)},${point.y.toFixed(D)}`
}

function toSvgData(points: Point[]) {
  return points.reduce((acc, point, i, a) =>
    i === 0
      ? `M ${point.x.toFixed(D)},${point.y.toFixed(D)}`
      : `${acc} ${bezierCommand(point, i, a)}`
  , '')
}
