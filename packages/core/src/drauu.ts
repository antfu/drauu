import { createNanoEvents } from 'nanoevents'
import { createModels } from './models'
import { Brush, Options, DrawingMode, EventsMap } from './types'

export class Drauu {
  el: SVGSVGElement | null = null
  shiftPressed = false
  altPressed = false

  private _emitter = createNanoEvents<EventsMap>()
  private _models = createModels(this)
  private _currentNode: SVGElement | undefined
  private _undoStack: Node[] = []
  private _disposables: (() => void)[] = []

  constructor(public options: Options = {}) {
    if (!this.options.brush)
      this.options.brush = { color: 'black', size: 3, mode: 'stylus' }
    if (options.el)
      this.mount(options.el)
  }

  get model() {
    return this._models[this.mode]
  }

  get mounted() {
    return !!this.el
  }

  get mode() {
    return this.options.brush!.mode || 'stylus'
  }

  set mode(v: DrawingMode) {
    this.options.brush!.mode = v
  }

  get brush() {
    return this.options.brush!
  }

  set brush(v: Brush) {
    this.options.brush = v
  }

  mount(selector: string | SVGSVGElement) {
    if (this.el)
      throw new Error('[drauu] already mounted, unmount previous target first')

    if (typeof selector === 'string')
      this.el = document.querySelector(selector)
    else
      this.el = selector

    if (!this.el)
      throw new Error('[drauu] target element not found')
    if (this.el.tagName !== 'svg')
      throw new Error('[drauu] can only mount to a SVG element')

    const el = this.el

    const start = this.eventStart.bind(this)
    const move = this.eventMove.bind(this)
    const end = this.eventEnd.bind(this)
    const keyboard = this.eventKeyboard.bind(this)

    el.addEventListener('pointerdown', start, false)
    el.addEventListener('touchstart', start, false)
    el.addEventListener('pointermove', move, false)
    el.addEventListener('touchmove', move, false)
    el.addEventListener('pointerup', end, false)
    el.addEventListener('touchend', end, false)
    window.addEventListener('keydown', keyboard, false)
    window.addEventListener('keyup', keyboard, false)

    this._disposables.push(() => {
      el.removeEventListener('mousedown', start, false)
      el.removeEventListener('touchstart', start, false)
      el.removeEventListener('mousemove', move, false)
      el.removeEventListener('touchmove', move, false)
      el.removeEventListener('mouseup', end, false)
      el.removeEventListener('touchend', end, false)
      window.removeEventListener('keydown', keyboard, false)
      window.removeEventListener('keyup', keyboard, false)
    })

    this._emitter.emit('mounted')
  }

  unmount() {
    this._disposables.forEach(fn => fn())
    this._disposables.length = 0
    this.el = null

    this._emitter.emit('unmounted')
  }

  on<K extends keyof EventsMap>(type: K, fn: EventsMap[K]) {
    return this._emitter.on(type, fn)
  }

  undo() {
    const el = this.el!
    if (!el.lastElementChild)
      return false
    this._undoStack.push(el.lastElementChild.cloneNode(true))
    el.lastElementChild.remove()
    this._emitter.emit('changed')
    return true
  }

  redo() {
    if (!this._undoStack.length)
      return false
    this.el!.appendChild(this._undoStack.pop()!)
    this._emitter.emit('changed')
    return true
  }

  canRedo() {
    return !!this._undoStack.length
  }

  canUndo() {
    return !!this.el?.lastElementChild
  }

  private eventMove(event: MouseEvent | TouchEvent) {
    if (this.model._eventMove(event)) {
      event.stopPropagation()
      event.preventDefault()
      this._emitter.emit('changed')
    }
  }

  private eventStart(event: MouseEvent | TouchEvent) {
    event.stopPropagation()
    event.preventDefault()
    if (this._currentNode)
      this.cancel()
    this._emitter.emit('start')
    this._currentNode = this.model._eventDown(event)
    if (this._currentNode)
      this.el!.appendChild(this._currentNode)
    this._emitter.emit('changed')
  }

  private eventEnd(event: MouseEvent | TouchEvent) {
    const result = this.model._eventUp(event)
    if (!result) {
      this.cancel()
    }
    else {
      if (result instanceof Element && result !== this._currentNode)
        this._currentNode = result
      this.commit()
    }
    this._emitter.emit('end')
    this._emitter.emit('changed')
  }

  private eventKeyboard(event: KeyboardEvent) {
    this.shiftPressed = event.shiftKey
    this.altPressed = event.altKey
    // redraw
    this.model.onMove(this.model.point)
    this._emitter.emit('changed')
  }

  private commit() {
    this._undoStack.length = 0
    const node = this._currentNode
    this._currentNode = undefined
    this._emitter.emit('committed', node)
  }

  clear() {
    this._undoStack.length = 0
    this.cancel()
    this.el!.innerHTML = ''
    this._emitter.emit('changed')
  }

  cancel() {
    if (this._currentNode) {
      this.el!.removeChild(this._currentNode)
      this._currentNode = undefined
      this._emitter.emit('canceled')
    }
  }

  dump() {
    return this.el!.innerHTML
  }

  load(svg: string) {
    this.clear()
    this.el!.innerHTML = svg
  }
}

export function createDrauu(options?: Options) {
  return new Drauu(options)
}
