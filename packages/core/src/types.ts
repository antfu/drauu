export interface Brush {
  /**
   * Stroke color
   */
  color: string
  /**
   * Stroke width
   */
  size: number
  /**
   * @default 'transparent'
   */
  fill?: string
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
   */
  dasharray?: string

  draw?: {
    /**
     * Read the presure from the given sensor and change the weight of the stroke
     *
     * @expiremental
     * @default false
     */
    pressure?: boolean
    /**
     * Simplify the points of the lines
     *
     * @expiremental
     * @default false
     */
    simplify?: boolean
  }

  rectangle?: {
    /**
     * @default 0
     */
    radius?: number
  }
}

export interface Point {
  x: number
  y: number
  force?: number
}

export type DrawingMode = 'draw' | 'line' | 'rectangle' | 'ellipse'

export type InputEvents = MouseEvent | TouchEvent | PointerEvent

export interface Options {
  el?: string | SVGSVGElement
  brush?: Brush
  /**
   * @default 'brush'
   */
  mode?: DrawingMode
  /**
   * @default 1
   */
  corrdinateScale?: number
}

export interface EventsMap {
  start: () => void
  end: () => void
  changed: () => void
  mounted: () => void
  unmounted: () => void
}
