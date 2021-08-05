import { createModels } from './models'
import { Brush, Options, DrawingMode } from './types'

export class Drauu {
  el: SVGSVGElement | null = null
  mode: DrawingMode
  brush: Brush

  private _models = createModels(this)
  private _currentNode: SVGElement | undefined
  private _undoStack: Node[] = []

  constructor(public options: Options = {}) {
    this.brush = options.brush || { color: 'black', size: 2 }
    this.mode = options.mode || 'draw'
    if (options.el)
      this.mount(options.el)
  }

  get model() {
    return this._models[this.mode]
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
  }

  unmounted() {
    // TODO:
  }

  undo() {
    const el = this.el!
    if (!el.lastElementChild)
      return false
    this._undoStack.push(el.lastElementChild.cloneNode(true))
    el.lastElementChild.remove()
    return true
  }

  redo() {
    if (!this._undoStack.length)
      return false
    this.el!.appendChild(this._undoStack.pop()!)
    return true
  }

  private eventMove(event: MouseEvent | TouchEvent) {
    if (this.model._eventMove(event)) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private eventDown(event: MouseEvent | TouchEvent) {
    event.stopPropagation()
    event.preventDefault()
    this._currentNode = this.model._eventDown(event)
    if (this._currentNode)
      this.el!.appendChild(this._currentNode)
  }

  private eventUp(event: MouseEvent | TouchEvent) {
    const result = this.model._eventUp(event)
    if (!result) {
      this.cancel()
    }
    else {
      if (result instanceof Element && result !== this._currentNode)
        this._currentNode = result
      this.commit()
    }
  }

  private commit() {
    this._undoStack.length = 0
    this._currentNode = undefined
  }

  clear() {
    this._undoStack.length = 0
    this.cancel()
    this.el!.innerHTML = ''
  }

  cancel() {
    if (this._currentNode) {
      this.el!.removeChild(this._currentNode)
      this._currentNode = undefined
    }
  }
}

export function createDrauu(options?: Options) {
  return new Drauu(options)
}
