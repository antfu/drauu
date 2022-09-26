/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

import type { Point } from '../types'

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1: Point, p2: Point) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y

  return dx * dx + dy * dy
}

// square distance from a point to a segment
function getSqSegDist(p: Point, p1: Point, p2: Point) {
  let x = p1.x
  let y = p1.y
  let dx = p2.x - x
  let dy = p2.y - y

  if (dx !== 0 || dy !== 0) {
    const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy)

    if (t > 1) {
      x = p2.x
      y = p2.y
    }
    else if (t > 0) {
      x += dx * t
      y += dy * t
    }
  }

  dx = p.x - x
  dy = p.y - y

  return dx * dx + dy * dy
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points: Point[], sqTolerance: number) {
  let prevPoint = points[0]
  const newPoints = [prevPoint]
  let point

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i]

    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point)
      prevPoint = point
    }
  }

  if (prevPoint !== point && point)
    newPoints.push(point)

  return newPoints
}

function simplifyDPStep(points: Point[], first: number, last: number, sqTolerance: number, simplified: Point[]) {
  let maxSqDist = sqTolerance
  let index = 0

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last])

    if (sqDist > maxSqDist) {
      index = i
      maxSqDist = sqDist
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified)
    simplified.push(points[index])
    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified)
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points: Point[], sqTolerance: number) {
  const last = points.length - 1

  const simplified = [points[0]]
  simplifyDPStep(points, 0, last, sqTolerance, simplified)
  simplified.push(points[last])

  return simplified
}

// both algorithms combined for awesome performance
export function simplify(points: Point[], tolerance: number, highestQuality = false) {
  if (points.length <= 2)
    return points

  const sqTolerance = tolerance !== undefined
    ? tolerance * tolerance
    : 1

  points = highestQuality
    ? points
    : simplifyRadialDist(points, sqTolerance)
  points = simplifyDouglasPeucker(points, sqTolerance)

  return points
}
