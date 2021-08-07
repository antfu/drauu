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
