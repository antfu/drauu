import type { Operation, Point } from '../types'
import { BaseModel } from './base'

export class EraserModel extends BaseModel<SVGRectElement> {
  svgPointPrevious?: DOMPoint
  svgPointCurrent?: DOMPoint

  pathSubFactor = 20
  pathFragments: { x1: number; x2: number; y1: number; y2: number; segment: number; element: any }[] = []

  private _erased: SVGElement[] = []

  onSelected(el: SVGSVGElement | null): void {
    const calculatePathFragments = (children: any, element?: any): void => {
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          const ele = children[i] as any
          if (ele.getTotalLength) {
            const pathLength = ele.getTotalLength()

            for (let j = 0; j < this.pathSubFactor; j++) {
              const pos1 = ele.getPointAtLength(pathLength * j / this.pathSubFactor)
              const pos2 = ele.getPointAtLength(pathLength * (j + 1) / this.pathSubFactor)
              this.pathFragments.push({
                x1: pos1.x,
                x2: pos2.x,
                y1: pos1.y,
                y2: pos2.y,
                segment: j,
                element: element || ele,
              })
            }
          }
          else {
            if (ele.children)
              calculatePathFragments(ele.children, ele)
          }
        }
      }
    }

    if (el)
      calculatePathFragments(el.children)
  }

  onUnselected(): void {
    this.pathFragments = []
  }

  override onStart(point: Point) {
    this.svgPointPrevious = this.vdom!.el.createSVGPoint()
    this.svgPointPrevious.x = point.x
    this.svgPointPrevious.y = point.y
    return undefined
  }

  override onMove(point: Point) {
    this.svgPointCurrent = this.vdom!.el.createSVGPoint()
    this.svgPointCurrent.x = point.x
    this.svgPointCurrent.y = point.y
    const erased = this.checkAndEraseElement()
    this.svgPointPrevious = this.svgPointCurrent
    return erased
  }

  override onEnd(): Operation {
    this.svgPointPrevious = undefined
    this.svgPointCurrent = undefined
    const erased = this._erased
    this._erased = []
    return {
      undo: () => erased.forEach(v => this.vdom!.restore(v)),
      redo: () => erased.forEach(v => this.vdom!.remove(v)),
    }
  }

  private checkAndEraseElement() {
    if (this.pathFragments.length) {
      for (let i = 0; i < this.pathFragments.length; i++) {
        const segment = this.pathFragments[i]
        const line = {
          x1: this.svgPointPrevious!.x,
          x2: this.svgPointCurrent!.x,
          y1: this.svgPointPrevious!.y,
          y2: this.svgPointCurrent!.y,
        }
        if (this.lineLineIntersect(segment, line)) {
          this.vdom.remove(segment.element)
          this._erased.push(segment.element)
        }
      }
    }

    if (this._erased.length)
      this.pathFragments = this.pathFragments.filter(v => !this._erased.includes(v.element))
    return this._erased.length > 0
  }

  private lineLineIntersect(line1: any, line2: any): boolean {
    const x1 = line1.x1
    const x2 = line1.x2
    const x3 = line2.x1
    const x4 = line2.x2
    const y1 = line1.y1
    const y2 = line1.y2
    const y3 = line2.y1
    const y4 = line2.y2
    const pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    const pt_x_num = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)
    const pt_y_num = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)
    const btwn = (a: number, b1: number, b2: number): boolean => {
      if ((a >= b1) && (a <= b2))
        return true
      return (a >= b2) && (a <= b1)
    }
    if (pt_denom === 0) {
      return false
    }
    else {
      const pt = {
        x: pt_x_num / pt_denom,
        y: pt_y_num / pt_denom,
      }
      return btwn(pt.x, x1, x2) && btwn(pt.y, y1, y2) && btwn(pt.x, x3, x4) && btwn(pt.y, y3, y4)
    }
  }
}
