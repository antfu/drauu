import { DrauuBaseModel } from './models/base'
import { DrauuDrawModel } from './models/draw'
import { DrauuPen, DrauuOptions } from './types'

export class Drauu {
  el: SVGSVGElement | null = null
  pen: DrauuPen = {
    color: 'black',
    width: 2,
  }

  model: DrauuBaseModel = new DrauuDrawModel(this)

  private tempNode: SVGElement | undefined
  private undoStack: Node[] = []

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

  undo() {
    const el = this.el!
    if (!el.lastElementChild)
      return false
    this.undoStack.push(el.lastElementChild.cloneNode(true))
    el.lastElementChild.remove()
    return true
  }

  redo() {
    if (!this.undoStack.length)
      return false
    this.el!.appendChild(this.undoStack.pop()!)
    return true
  }

  eventMove(event: MouseEvent | TouchEvent) {
    this.model._eventMove(event)
  }

  eventDown(event: MouseEvent | TouchEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.tempNode = this.model._eventDown(event)
    if (this.tempNode)
      this.el!.appendChild(this.tempNode)
  }

  eventUp(event: MouseEvent | TouchEvent) {
    const result = this.model._eventUp(event)
    if (!result)
      this.cancel()
    else
      this.commit()
  }

  private commit() {
    this.undoStack.length = 0
    this.tempNode = undefined
  }

  private cancel() {
    if (this.tempNode) {
      this.el!.removeChild(this.tempNode)
      this.tempNode = undefined
    }
  }
}

export function createDrauu(options?: DrauuOptions) {
  return new Drauu(options)
}
