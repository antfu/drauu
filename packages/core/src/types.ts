export interface Brush {
  color: string
  size: number
  /**
   * @default 4
   */
  smoothness?: number
}

export interface Point {
  x: number
  y: number
}

export type DrawingMode = 'draw' | 'line' | 'rect'

export interface Options {
  el?: string | SVGSVGElement
  brush?: Brush
  mode?: DrawingMode
}
