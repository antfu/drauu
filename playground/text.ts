import type { Point } from 'drauu'
import { BaseModel } from 'drauu'

export interface TextBrush {
  /** text content */
  text?: string
  /** font size */
  fontSize?: number
  /** font family */
  fontFamily?: string
}

export class TextModel extends BaseModel<SVGTextElement> {
  private text: string | undefined
  private fontSize: number | undefined
  private fontFamily: string | undefined

  override onStart(point: Point) {
    if (!this.text)
      return
    this.el = this.createElement('text')

    this.fontSize = this.fontSize || 16
    this.attr('x', point.x)
    this.attr('y', point.y)
    this.attr('font-size', this.fontSize!)
    this.fontFamily && this.attr('font-family', this.fontFamily)
    this.attr('fill', this.brush.color)
    this.el.textContent = this.text

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

  setOptions(options: TextBrush) {
    super.setOptions(options)
    this.text = options.text
    this.fontSize = options.fontSize
    this.fontFamily = options.fontFamily
  }
}
