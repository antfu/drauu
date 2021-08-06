/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drauu } from '../drauu'
import { Point } from '../types'

export abstract class BaseModel<T extends SVGElement> {
  event: MouseEvent | TouchEvent = undefined!
  point: Point = undefined!
  start: Point = undefined!
  el: T | null = null

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

  get altPressed() {
    return this.drauu.altPressed
  }

  getMousePosition(event: MouseEvent | TouchEvent) {
    const rect = this.drauu.el!.getBoundingClientRect()
    const scale = this.drauu.options.corrdinateScale ?? 1

    if (event instanceof MouseEvent) {
      return {
        x: (event.pageX - rect.left) * scale,
        y: (event.pageY - rect.top) * scale,
      }
    }
    if (event instanceof TouchEvent) {
      return {
        x: ((event.targetTouches[0]?.pageX || 0) - rect.left) * scale,
        y: ((event.targetTouches[0]?.pageY || 0) - rect.top) * scale,
      }
    }
    throw new Error('unsupported event type')
  }

  protected createElement<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K] {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)
    el.setAttribute('fill', this.brush.fill ?? 'transparent')
    el.setAttribute('stroke', this.brush.color)
    el.setAttribute('stroke-width', this.brush.size.toString())
    el.setAttribute('stroke-linecap', 'round')

    if (this.brush.dasharray)
      el.setAttribute('stroke-dasharray', this.brush.dasharray)

    return el
  }

  protected attr(name: keyof T, value: string | number) {
    this.el!.setAttribute(name as string, value.toString())
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
    this.start = this.point
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
