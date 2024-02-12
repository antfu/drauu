import { createNanoEvents } from 'nanoevents'
import { createModels } from './models'
import type { Brush, DrawingMode, EventsMap, Options } from './types'

export class Drauu {
  el: SVGSVGElement | null = null
  svgPoint: DOMPoint | null = null
  eventEl: Element | null = null
  shiftPressed = false
  altPressed = false
  drawing = false

  private _emitter = createNanoEvents<EventsMap>()
  private _originalPointerId: number | null = null
  private _models = createModels(this)
  private _currentNode: SVGElement | undefined
  private _undoStack: Node[] = []
  private _disposables: (() => void)[] = []

  constructor(public options: Options = {}) {
    if (!this.options.brush)
      this.options.brush = { color: 'black', size: 3, mode: 'stylus' }
    if (options.el)
      this.mount(options.el, options.eventTarget, options.window)
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
    const unselected = this._models[this.mode]
    unselected.onUnselected()

    this.options.brush!.mode = v
    this.model.onSelected(this.el)
  }

  get brush() {
    return this.options.brush!
  }

  set brush(v: Brush) {
    this.options.brush = v
  }

  resolveSelector<T>(selector: string | T | null | undefined): T | null {
    if (typeof selector === 'string')
      return document.querySelector(selector) as unknown as T
    else
      return selector || null
  }

  mount(el: string | SVGSVGElement, eventEl?: string | Element, listenWindow: Window = window) {
    if (this.el)
      throw new Error('[drauu] already mounted, unmount previous target first')

    this.el = this.resolveSelector(el)

    if (!this.el)
      throw new Error('[drauu] target element not found')
    if (this.el.tagName.toLocaleLowerCase() !== 'svg')
      throw new Error('[drauu] can only mount to a SVG element')
    if (!this.el.createSVGPoint)
      throw new Error('[drauu] SVG element must be create by document.createElementNS(\'http://www.w3.org/2000/svg\', \'svg\')')

    this.svgPoint = this.el.createSVGPoint()

    const target: SVGSVGElement = this.resolveSelector(eventEl as any) || this.el!

    const start = this.eventStart.bind(this)
    const move = this.eventMove.bind(this)
    const end = this.eventEnd.bind(this)
    const keyboard = this.eventKeyboard.bind(this)

    target.addEventListener('pointerdown', start, { passive: false })
    listenWindow.addEventListener('pointermove', move, { passive: false })
    listenWindow.addEventListener('pointerup', end, { passive: false })
    listenWindow.addEventListener('pointercancel', end, { passive: false })
    listenWindow.addEventListener('keydown', keyboard, false)
    listenWindow.addEventListener('keyup', keyboard, false)

    this._disposables.push(() => {
      target.removeEventListener('pointerdown', start)
      listenWindow.removeEventListener('pointermove', move)
      listenWindow.removeEventListener('pointerup', end)
      listenWindow.removeEventListener('pointercancel', end)
      listenWindow.removeEventListener('keydown', keyboard, false)
      listenWindow.removeEventListener('keyup', keyboard, false)
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

  private eventMove(event: PointerEvent) {
    if (!this.acceptsInput(event) || !this.drawing)
      return

    if (this.model._eventMove(event)) {
      event.stopPropagation()
      event.preventDefault()
      this._emitter.emit('changed')
    }
  }

  private eventStart(event: PointerEvent) {
    if (!this.acceptsInput(event))
      return
    event.stopPropagation()
    event.preventDefault()
    if (this._currentNode)
      this.cancel()
    this.drawing = true
    this._originalPointerId = event.pointerId
    this._emitter.emit('start')
    this._currentNode = this.model._eventDown(event)
    if (this._currentNode && this.mode !== 'eraseLine')
      this.el!.appendChild(this._currentNode)
    this._emitter.emit('changed')
  }

  private eventEnd(event: PointerEvent) {
    if (!this.acceptsInput(event) || !this.drawing)
      return
    const result = this.model._eventUp(event)
    if (!result) {
      this.cancel()
    }
    else {
      if (result instanceof Element && result !== this._currentNode)
        this._currentNode = result
      this.commit()
    }
    this.drawing = false
    this._emitter.emit('end')
    this._emitter.emit('changed')
    this._originalPointerId = null
  }

  private acceptsInput(event: PointerEvent) {
    return (!this.options.acceptsInputTypes || this.options.acceptsInputTypes.includes(event.pointerType as any))
          && !(this._originalPointerId && this._originalPointerId !== event.pointerId)
  }

  private eventKeyboard(event: KeyboardEvent) {
    if (this.shiftPressed === event.shiftKey && this.altPressed === event.altKey)
      return
    this.shiftPressed = event.shiftKey
    this.altPressed = event.altKey
    // redraw
    if (this.model.point) {
      if (this.model.onMove(this.model.point))
        this._emitter.emit('changed')
    }
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
