import type { Operation } from '../types'

export class VDom {
  constructor(public el: SVGSVGElement) {
  }

  private _elements: (SVGElement | null)[] = []

  append(el: SVGElement) {
    const last = this._elements.at(-1)
    if (last)
      last.after(el)
    else
      this.el.append(el)
    const index = this._elements.push(el) - 1
    el.dataset.drauu_index = index.toString()
  }

  remove(el: SVGElement) {
    el.remove()
    this._elements[+el.dataset.drauu_index!] = null
  }

  restore(el: SVGElement) {
    const index = +el.dataset.drauu_index!
    this._elements[index] = el
    for (let i = index - 1; i >= 0; i--) {
      const last = this._elements[i]
      if (last) {
        last.after(el)
        return
      }
    }
    this.el.prepend(el)
  }

  appendOp(el: SVGElement): Operation {
    this.append(el)
    return {
      undo: () => this.remove(el),
      redo: () => this.restore(el),
    }
  }
}

export function createArrowHead(id: string, fill: string) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
  const head = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  head.setAttribute('fill', fill)
  marker.setAttribute('id', id)
  marker.setAttribute('viewBox', '0 -5 10 10')
  marker.setAttribute('refX', '5')
  marker.setAttribute('refY', '0')
  marker.setAttribute('markerWidth', '4')
  marker.setAttribute('markerHeight', '4')
  marker.setAttribute('orient', 'auto')
  head.setAttribute('d', 'M0,-5L10,0L0,5')
  marker.appendChild(head)
  defs.appendChild(marker)

  return defs
}
