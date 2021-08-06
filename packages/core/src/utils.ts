export function numSort(a: number, b: number) {
  return a - b
}

export function getSymbol(a: number) {
  if (a < 0)
    return -1
  return 1
}

export function splitNum(a: number) {
  return [Math.abs(a), getSymbol(a)]
}
