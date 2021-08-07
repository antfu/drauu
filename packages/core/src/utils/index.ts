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

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id/6860916
export function guid() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`)
}

export const DECIMAL = 2

export const D = DECIMAL
