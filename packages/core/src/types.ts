export type DrawingMode = 'draw' | 'line' | 'rectangle' | 'ellipse'

export interface Brush {
  /**
   * @default 'brush'
   */
  mode?: DrawingMode

  /**
   * Stroke color
   */
  color: string

  /**
   * Stroke width
   */
  size: number

  /**
   * Color filled, only works in `rectangle` and `ellipse` mode.
   * @default 'transparent'
   */
  fill?: string

  /**
   * Pattern of dashes, set to `undefined` for solid line.
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
   */
  dasharray?: string

  /**
   * Read the presure from the given sensor and change the weight of the stroke.
   * Works only in `draw` mode.
   *
   * @expiremental
   * @default false
   */
  pressure?: boolean

  /**
   * Simplify the points of the lines.
   * Works only in `draw` mode.
   *
   * @expiremental
   * @default false
   */
  simplify?: boolean

  /**
   * Corner radius of the rectangle.
   * Works only in `rectangle` mode.
   *
   * @default 0
   */
  cornerRadius?: number

  /**
   * Show an arrow at the end of the line.
   * Works only in `draw` and `line` mode.
   *
   * @default false
   */
  arrowEnd?: boolean
}

export interface Point {
  x: number
  y: number
  force?: number
}

export type InputEvents = MouseEvent | TouchEvent | PointerEvent

export interface Options {
  el?: string | SVGSVGElement
  brush?: Brush

  /**
   * @default 1
   */
  corrdinateScale?: number
}

export interface EventsMap {
  start: () => void
  end: () => void
  committed: (node: SVGElement | undefined) => void
  canceled: () => void
  changed: () => void
  mounted: () => void
  unmounted: () => void
}
