/* eslint-disable @typescript-eslint/no-unused-vars */
import { Brush } from '../types'
import { Drauu } from '../drauu'
import { InputEvents, Point } from '../types'
import { D } from '../utils'

export abstract class BaseModel<T extends SVGElement> {
  event: MouseEvent | TouchEvent = undefined!
  point: Point = undefined!
  start: Point = undefined!
  el: T | null = null

  constructor(private drauu: Drauu) {}

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

  getMousePosition(event: InputEvents): Point {
    const rect = this.drauu.el!.getBoundingClientRect()
    const scale = this.drauu.options.coordinateScale ?? 1

    if (event instanceof PointerEvent || event instanceof MouseEvent) {
      return {
        x: (event.pageX - rect.left) * scale,
        y: (event.pageY - rect.top) * scale,
        pressure: (event as PointerEvent).pressure,
      }
    }
    if (event instanceof TouchEvent) {
      return {
        x: ((event.targetTouches[0]?.pageX || 0) - rect.left) * scale,
        y: ((event.targetTouches[0]?.pageY || 0) - rect.top) * scale,
        pressure: event.targetTouches[0]?.force,
      }
    }
    throw new Error('unsupported event type')
  }

  protected createElement<K extends keyof SVGElementTagNameMap>(name: K, overrides?: Partial<Brush>): SVGElementTagNameMap[K] {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)
    const brush = overrides
      ? {
        ...this.brush,
        ...overrides,
      }
      : this.brush

    el.setAttribute('fill', brush.fill ?? 'transparent')
    el.setAttribute('stroke', brush.color)
    el.setAttribute('stroke-width', brush.size.toString())
    el.setAttribute('stroke-linecap', 'round')

    if (brush.dasharray)
      el.setAttribute('stroke-dasharray', brush.dasharray)

    return el
  }

  protected attr(name: string, value: string | number) {
    this.el!.setAttribute(name, typeof value === 'string' ? value : value.toFixed(D))
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
