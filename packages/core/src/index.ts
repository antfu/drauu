export interface DrauuOptions {

}

export interface DrauuPen {
  color: string
  width: number
}

export class Drauu {
  el: Element | null = null

  constructor(public options: DrauuOptions = {}) {}

  mount(selector: string | Element) {
    if (typeof selector === 'string')
      this.el = document.querySelector(selector)
    else
      this.el = selector

    // TODO: mount
  }
}

export function createDrauu(options?: DrauuOptions) {
  return new Drauu(options)
}
