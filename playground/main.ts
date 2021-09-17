import 'virtual:windi.css'
import { createDrauu, Brush } from 'drauu'
import './style.css'

const drauu = createDrauu({
  el: '#svg',
  brush: {
    color: '#000',
    size: 3,
  },
  // acceptsInputTypes: ['pen'],
})

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
    if (e.shiftKey)
      drauu.redo()
    else
      drauu.undo()
    return
  }

  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey)
    return

  if (e.code === 'KeyL')
    drauu.mode = 'line'

  else if (e.code === 'KeyD')
    drauu.mode = 'draw'

  else if (e.code === 'KeyS')
    drauu.mode = 'stylus'

  else if (e.code === 'KeyR')
    drauu.mode = 'rectangle'

  else if (e.code === 'KeyE')
    drauu.mode = 'ellipse'

  else if (e.code === 'KeyC')
    drauu.clear()

  else if (e.code === 'Equal')
    drauu.brush.size += 0.5

  else if (e.code === 'Minus')
    drauu.brush.size -= 0.5
})

document.getElementById('undo')?.addEventListener('click', () => drauu.undo())
document.getElementById('redo')?.addEventListener('click', () => drauu.redo())
document.getElementById('clear')?.addEventListener('click', () => drauu.clear())
document.getElementById('download')?.addEventListener('click', () => {
  drauu.el!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const data = drauu.el!.outerHTML || ''
  const blob = new Blob([data], { type: 'image/svg+xml' })
  const elem = window.document.createElement('a')
  elem.href = window.URL.createObjectURL(blob)
  elem.download = 'drauu.svg'
  document.body.appendChild(elem)
  elem.click()
  document.body.removeChild(elem)
})

const sizeEl = document.getElementById('size')! as HTMLInputElement
sizeEl.addEventListener('input', () => drauu.brush.size = +sizeEl.value)

const modes: { el: HTMLElement; brush: Partial<Brush> }[] = [
  { el: document.getElementById('m-stylus')!, brush: { mode: 'stylus', arrowEnd: false } },
  { el: document.getElementById('m-draw')!, brush: { mode: 'draw', arrowEnd: false } },
  { el: document.getElementById('m-line')!, brush: { mode: 'line', arrowEnd: false } },
  { el: document.getElementById('m-arrow')!, brush: { mode: 'line', arrowEnd: true } },
  { el: document.getElementById('m-rect')!, brush: { mode: 'rectangle', arrowEnd: false } },
  { el: document.getElementById('m-ellipse')!, brush: { mode: 'ellipse', arrowEnd: false } },
]
modes.forEach(({ el, brush }) => {
  el.addEventListener('click', () => {
    modes.forEach(({ el }) => el.classList.remove('active'))
    el.classList.add('active')
    Object.assign(drauu.brush, brush)
  })
})

const lines: { el: HTMLElement; value: string | undefined}[] = [
  { el: document.getElementById('l-solid')!, value: undefined },
  { el: document.getElementById('l-dashed')!, value: '4' },
  { el: document.getElementById('l-dotted')!, value: '1 7' },
]

lines.forEach(({ el, value }) => {
  el.addEventListener('click', () => {
    lines.forEach(({ el }) => el.classList.remove('active'))
    el.classList.add('active')
    drauu.brush.dasharray = value
  })
})

const colors = Array.from(document.querySelectorAll('[data-color]'))
colors
  .forEach((i) => {
    i.addEventListener('click', () => {
      colors.forEach(i => i.classList.remove('active'))
      i.classList.add('active')
      drauu.brush.color = (i as HTMLElement).dataset.color!
    })
  })
