import 'virtual:windi.css'
import { createDrauu } from 'drauu'

const drauu = createDrauu({
  el: '#svg',
  brush: {
    color: '#915930',
    size: 2,
  },
})

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
    if (e.shiftKey)
      drauu.redo()
    else
      drauu.undo()
  }
  else if (e.code === 'KeyL') {
    drauu.mode = 'line'
  }
  else if (e.code === 'KeyD') {
    drauu.mode = 'draw'
  }
  else if (e.code === 'KeyR') {
    drauu.mode = 'rect'
  }
  else if (e.code === 'KeyC') {
    drauu.clear()
  }
  else if (e.code === 'Equal') {
    drauu.brush.size += 0.5
  }
  else if (e.code === 'Minus') {
    drauu.brush.size -= 0.5
  }
})

const colorEl = document.getElementById('color')! as HTMLInputElement
colorEl.addEventListener('change', (e: any) => {
  drauu.brush.color = e.target.value
  drauu.cancel()
})
colorEl.value = drauu.brush.color
