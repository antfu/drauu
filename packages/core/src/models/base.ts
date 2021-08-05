/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drauu } from '../drauu'
import { Point } from '../types'

export abstract class BaseModel {
  event: MouseEvent | TouchEvent = undefined!
  point: Point = undefined!

  constructor(private drauu: Drauu) {
  }

  onStart(point: Point): SVGElement | undefined {
    return undefined
  }

  onMove(point: Point): boolean {
    return false
  }

  onEnd(point: Point): SVGElement | boolean | undefined {
    return undefined
  }

  get brush() {
    return this.drauu.brush
  }

  get shiftPressed() {
    return this.drauu.shiftPressed
  }

  getMousePosition(event: MouseEvent | TouchEvent) {
    const rect = this.drauu.el!.getBoundingClientRect()
    if (event instanceof MouseEvent)
      return { x: event.pageX - rect.left, y: event.pageY - rect.top }
    if (event instanceof Touch)
      return { x: event.targetTouches[0].pageX - rect.left, y: event.targetTouches[0].pageY - rect.top }
    throw new Error('unsupported event type')
  }

  protected createElement<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K] {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)
    el.setAttribute('fill', this.brush.fill ?? 'transparent')
    el.setAttribute('stroke', this.brush.color)
    el.setAttribute('stroke-width', this.brush.size.toString())
    el.setAttribute('stroke-linecap', 'round')

    return el
  }

  private _setEvent(event: MouseEvent | TouchEvent) {
    this.event = event
    this.point = this.getMousePosition(event)
  }

  /**
   * @internal
   */
  _eventDown(event: MouseEvent | TouchEvent) {
    this._setEvent(event)
    return this.onStart(this.point)
  }

  /**
   * @internal
   */
  _eventMove(event: MouseEvent | TouchEvent) {
    this._setEvent(event)
    return this.onMove(this.point)
  }

  /**
   * @internal
   */
  _eventUp(event: MouseEvent | TouchEvent) {
    this._setEvent(event)
    return this.onEnd(this.point)
  }
}
