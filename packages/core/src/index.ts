export interface DrauuOptions {
  el?: string | SVGSVGElement
}

export interface DrauuPen {
  color: string
  width: number
}

export interface Point {
  x: number
  y: number
}

export class Drauu {
  el: SVGSVGElement | null = null
  pen: DrauuPen = {
    color: 'black',
    width: 2,
  }

  private path: SVGPathElement | null = null
  private strPath = ''
  private buffer: Point[] = []
  private bufferSize = 2

  constructor(public options: DrauuOptions = {}) {
    if (options.el)
      this.mount(options.el)
  }

  mount(selector: string | SVGSVGElement) {
    if (typeof selector === 'string')
      this.el = document.querySelector(selector)
    else
      this.el = selector

    if (!this.el)
      throw new Error('[drauu] target element not found')
    if (this.el.tagName !== 'svg')
      throw new Error('[drauu] can only mount to a SVG element')

    this.el.addEventListener('mousedown', this.eventDown.bind(this), false)
    this.el.addEventListener('touchstart', this.eventDown.bind(this), false)
    this.el.addEventListener('mousemove', this.eventMove.bind(this), false)
    this.el.addEventListener('touchmove', this.eventMove.bind(this), false)
    this.el.addEventListener('mouseup', this.eventUp.bind(this), false)
    this.el.addEventListener('touchend', this.eventUp.bind(this), false)

    // eslint-disable-next-line no-console
    console.log('drauu mounted')
  }

  unmounted() {
    // TODO:
  }

  eventMove(ev: MouseEvent | TouchEvent) {
    if (this.path) {
      ev.stopPropagation()
      ev.preventDefault()
      this.appendToBuffer(this.getMousePosition(ev))
      this.updateSvgPath()
    }
  }

  eventDown(ev: MouseEvent | TouchEvent) {
    ev.stopPropagation()
    ev.preventDefault()
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.path.setAttribute('fill', 'transparent')
    this.path.setAttribute('stroke', this.pen.color)
    this.path.setAttribute('stroke-width', this.pen.width.toString())
    this.path.setAttribute('stroke-linecap', 'round')
    this.buffer = []
    const pt = this.getMousePosition(ev)
    this.appendToBuffer(pt)
    this.strPath = `M${this.nicerDecimal(pt.x)} ${this.nicerDecimal(pt.y)}`
    this.path.setAttribute('d', this.strPath)
    this.el!.appendChild(this.path)
  }

  eventUp() {
    if (!this.path)
      return false
    if (!this.path.getTotalLength()) {
      this.el!.lastElementChild?.remove()
      this.path = null
      return false
    }
    this.path = null
    return true
  }

  // these are some utility functions
  getMousePosition(ev: MouseEvent | TouchEvent) {
    const rect = this.el!.getBoundingClientRect()
    if (ev instanceof MouseEvent) return { x: ev.pageX - rect.left, y: ev.pageY - rect.top }
    if (ev instanceof Touch) return { x: ev.targetTouches[0].pageX - rect.left, y: ev.targetTouches[0].pageY - rect.top }
    throw new Error('unsupported event type')
  }

  updateSvgPath() {
    let pt = this.getAveragePoint(0)
    if (!pt)
      return

    // Get the smoothed part of the path that will not change
    this.strPath += ` L${this.nicerDecimal(pt.x)} ${this.nicerDecimal(pt.y)}`
    // Get the last part of the path (close to the current mouse position)
    // This part will change if the mouse moves again
    let tmpPath = ''
    for (let offset = 2; offset < this.buffer.length; offset += 2) {
      pt = this.getAveragePoint(offset)
      if (pt)
        tmpPath += ` L${this.nicerDecimal(pt.x)} ${this.nicerDecimal(pt.y)}`
    }
    // Set the complete current path coordinates
    this.path!.setAttribute('d', this.strPath + tmpPath)
  }

  appendToBuffer(point: Point) {
    this.buffer.push(point)
    while (this.buffer.length > this.bufferSize)
      this.buffer.shift()
  }

  // Calculate the average point, starting at offset in the buffer
  getAveragePoint(offset: number): Point | null {
    const len = this.buffer.length
    if (len % 2 === 1 || len >= this.bufferSize) {
      let totalX = 0
      let totalY = 0
      let pt, i
      let count = 0
      for (i = offset; i < len; i++) {
        count++
        pt = this.buffer[i]
        totalX += pt.x
        totalY += pt.y
      }
      return {
        x: totalX / count,
        y: totalY / count,
      }
    }
    return null
  }

  nicerDecimal(d: number) {
    return Math.floor(d * 100) / 100
  }
}

export function createDrauu(options?: DrauuOptions) {
  return new Drauu(options)
}
