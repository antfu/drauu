/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drauu } from '../index'
import { Point } from '../types'

export class DrauuBaseModel {
  lastEvent: MouseEvent | TouchEvent | undefined
  points: Point[] = []

  constructor(private drauu: Drauu) {
  }

  get pen() {
    return this.drauu.pen
  }

  onStart(event: MouseEvent | TouchEvent, lastPoints: Point[]): SVGElement | undefined {
    return undefined
  }

  onMove(event: MouseEvent | TouchEvent) {

  }

  onEnd(event: MouseEvent | TouchEvent, points: Point[]): SVGElement | boolean | undefined {
    return undefined
  }

  getMousePosition(event: MouseEvent | TouchEvent) {
    const rect = this.drauu.el!.getBoundingClientRect()
    if (event instanceof MouseEvent)
      return { x: event.pageX - rect.left, y: event.pageY - rect.top }
    if (event instanceof Touch)
      return { x: event.targetTouches[0].pageX - rect.left, y: event.targetTouches[0].pageY - rect.top }
    throw new Error('unsupported event type')
  }

  _eventDown(event: MouseEvent | TouchEvent) {
    const lastPoints = this.points
    this.points = []
    this.lastEvent = event
    return this.onStart(event, lastPoints)
  }

  _eventMove(event: MouseEvent | TouchEvent) {
    this.lastEvent = event
    return this.onMove(event)
  }

  _eventUp(event: MouseEvent | TouchEvent) {
    this.lastEvent = event
    return this.onEnd(event, this.points)
  }
}
