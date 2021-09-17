import type { StrokeOptions } from 'perfect-freehand'

export type DrawingMode = 'draw' | 'stylus' | 'line' | 'rectangle' | 'ellipse'

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

  /**
   * Options for 'perfect-freehand'
   */
  stylusOptions?: StrokeOptions
}

export interface Point {
  x: number
  y: number
  pressure?: number
}

export interface Options {
  el?: string | SVGSVGElement

  brush?: Brush

  /**
   * Filter out events based on input type
   *
   * @default ['mouse', 'touch', 'pen']
   */
  acceptsInputTypes?: ('mouse' | 'touch' | 'pen')[]

  /**
   * Use different element to listen on the events
   *
   * @default the `el` option
   */
  eventTarget?: string | Element

  /**
   * When you apply a scale transform to the svg container,
   * set this property to let drauu aware of the currect coordinates.
   * @default 1
   */
  coordinateScale?: number

  /**
   * Apply SVG CTM transform when calculating the coordinates.
   *
   * @advanced you don't commonly need this
   * @default true
   */
  coordinateTransform?: boolean
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
