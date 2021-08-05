import 'virtual:windi.css'
import { createDrauu } from 'drauu'

const drauu = createDrauu()

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
    if (e.shiftKey)
      drauu.redo()
    else
      drauu.undo()
  }
})

drauu.mount('#svg')
