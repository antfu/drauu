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
     * WIP
     * @default true
     */
    pressure?: boolean
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
