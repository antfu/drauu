export interface DrauuOptions {
  el?: string | SVGSVGElement
}

export interface DrauuPen {
  color: string
  width: number
  /**
   * @default 4
   */
  smoothness?: number
}

export interface Point {
  x: number
  y: number
}
