import type { Point } from '../types'
import { BaseModel } from './base'

export class TextModel extends BaseModel<SVGTextElement> {
  private fontSize: number | undefined

  override onStart(point: Point) {
    if (!this.brush.text)
      return
    this.el = this.createElement('text')

    this.fontSize = this.fontSize || 16
    this.attr('x', point.x)
    this.attr('y', point.y)
    this.attr('font-size', this.fontSize!)
    this.brush.fontFamily && this.attr('font-family', this.brush.fontFamily)
    this.attr('fill', this.brush.color)
    this.el.textContent = this.brush.text

    return this.el
  }

  override onMove(point: Point) {
    if (!this.el || !this.start)
      return false

    // Calculate the slope amplification of the font and keep the font's center point unchanged.
    const dx = point.x - this.start.x
    const dy = point.y - this.start.y
    const angle = Math.atan2(dy, dx)
    const fontSize = this.fontSize! + Math.sqrt(dx * dx + dy * dy) / 10
    const textWidth = this.el.getComputedTextLength()
    const textHeight = fontSize
    const textX = this.start.x - textWidth / 2
    const textY = this.start.y + textHeight / 2
    this.attr('font-size', fontSize)
    this.attr('x', textX)
    this.attr('y', textY)
    this.attr('transform', `rotate(${angle * 180 / Math.PI} ${this.start.x} ${this.start.y})`)

    return true
  }

  override onEnd() {
    const path = this.el
    this.el = null

    if (!path)
      return false
    return true
  }
}
