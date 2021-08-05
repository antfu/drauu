import { Point } from '../types'
import { decimal } from '../utils'
import { BaseModel } from './base'

export class DrawModel extends BaseModel<SVGPathElement> {
  private smoothBuffer: Point[] = []
  private strPath = ''

  override onStart(point: Point) {
    this.el = this.createElement('path')
    this.smoothBuffer = []
    this.appendToBuffer(point)
    this.strPath = `M${decimal(point.x)} ${decimal(point.y)}`
    this.attr('d' as any, this.strPath)

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el)
      return false

    this.appendToBuffer(point)
    this.updateSvgPath()
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

  get smoothness() {
    return this.brush.draw?.smoothness ?? 4
  }

  appendToBuffer(point: Point) {
    this.smoothBuffer.push(point)
    while (this.smoothBuffer.length > this.smoothness)
      this.smoothBuffer.shift()
  }

  updateSvgPath() {
    let pt = this.getAveragePoint(0)
    if (!pt)
      return

    // Get the smoothed part of the path that will not change
    this.strPath += ` L${decimal(pt.x)} ${decimal(pt.y)}`
    // Get the last part of the path (close to the current mouse position)
    // This part will change if the mouse moves again
    let tmpPath = ''
    for (let offset = 2; offset < this.smoothBuffer.length; offset += 2) {
      pt = this.getAveragePoint(offset)
      if (pt)
        tmpPath += ` L${decimal(pt.x)} ${decimal(pt.y)}`
    }
    // Set the complete current path coordinates
    this.el!.setAttribute('d', this.strPath + tmpPath)
  }

  // Calculate the average point, starting at offset in the buffer
  getAveragePoint(offset: number): Point | null {
    const len = this.smoothBuffer.length
    if (len % 2 === 1 || len >= this.smoothness) {
      let totalX = 0
      let totalY = 0
      let pt, i
      let count = 0
      for (i = offset; i < len; i++) {
        count++
        pt = this.smoothBuffer[i]
        totalX += pt.x
        totalY += pt.y
      }
      return {
        x: totalX / count,
        y: totalY / count,
      }
    }
    return null
  }
}
