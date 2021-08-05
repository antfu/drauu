import { Drauu } from '../drauu'
import { DrawingMode } from '../types'

import { BaseModel } from './base'
import { DrawModel } from './draw'
import { EllipseModel } from './ellipse'
import { LineModel } from './line'
import { RectModel } from './rect'

export function createModels(drauu: Drauu): Record<DrawingMode, BaseModel<SVGElement>> {
  return {
    draw: new DrawModel(drauu),
    line: new LineModel(drauu),
    rectangle: new RectModel(drauu),
    ellipse: new EllipseModel(drauu),
  }
}
