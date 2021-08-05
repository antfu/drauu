export interface Brush {
  color: string
  size: number
  /**
   * @default 'transparent'
   */
  fill?: string

  draw?: {
    /**
     * @default 4
     */
    smoothness?: number

    /**
     * WIP
     * @default 0
     */
    pressure?: number
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
  changed: () => void
  mounted: () => void
  unmounted: () => void
}
