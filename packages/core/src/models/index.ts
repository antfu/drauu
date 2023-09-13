import type { Drauu } from '../drauu'
import type { DrawingMode } from '../types'

import type { BaseModel } from './base'
import { StylusModel } from './stylus'
import { EllipseModel } from './ellipse'
import { LineModel } from './line'
import { RectModel } from './rect'
import { DrawModel } from './draw'
import { EraserModel } from './eraser'

export function createModels(drauu: Drauu): Record<DrawingMode, BaseModel<SVGElement>> {
  return {
    draw: new DrawModel(drauu),
    stylus: new StylusModel(drauu),
    line: new LineModel(drauu),
    rectangle: new RectModel(drauu),
    ellipse: new EllipseModel(drauu),
    eraseLine: new EraserModel(drauu),
  }
}

export { StylusModel, EllipseModel, LineModel, RectModel, DrawModel, EraserModel }
