import type { Brush, Operation, Point } from '../types'
import type { Drauu } from '../drauu'
import { D } from '../utils'

export abstract class BaseModel<T extends SVGElement> {
  event: PointerEvent = undefined!
  point: Point = undefined!
  start: Point = undefined!
  el: T | null = null

  constructor(protected drauu: Drauu) {}

  onSelected(_el: SVGSVGElement | null): void {
  }

  onUnselected(): void {
  }

  onStart(_point: Point): SVGElement | undefined {
    return undefined
  }

  onMove(_point: Point): boolean {
    return false
  }

  onEnd(_point: Point): Operation | boolean | undefined {
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

  get svgElement() {
    return this.drauu.el
  }

  getMousePosition(event: PointerEvent): Point {
    const el = this.drauu.el!
    const scale = this.drauu.options.coordinateScale ?? 1
    const offset = this.drauu.options.offset ?? { x: 0, y: 0 }

    if (this.drauu.options.coordinateTransform === false) {
      const rect = this.drauu.el!.getBoundingClientRect()
      return {
        x: (event.pageX - rect.left + offset.x) * scale,
        y: (event.pageY - rect.top + offset.y) * scale,
        pressure: event.pressure,
      }
    }
    else {
      const point = this.drauu.svgPoint!
      point.x = event.clientX + offset.x
      point.y = event.clientY + offset.y
      const loc = point.matrixTransform(el.getScreenCTM()?.inverse())
      return {
        x: loc.x * scale,
        y: loc.y * scale,
        pressure: event.pressure,
      }
    }
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

  private _setEvent(event: PointerEvent) {
    this.event = event
    this.point = this.getMousePosition(event)
  }

  /**
   * @internal
   */
  _eventDown(event: PointerEvent) {
    this._setEvent(event)
    this.start = this.point
    return this.onStart(this.point)
  }

  /**
   * @internal
   */
  _eventMove(event: PointerEvent) {
    this._setEvent(event)
    return this.onMove(this.point)
  }

  /**
   * @internal
   */
  _eventUp(event: PointerEvent) {
    this._setEvent(event)
    return this.onEnd(this.point)
  }
}
