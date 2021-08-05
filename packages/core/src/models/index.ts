import { Drauu } from '../drauu'
import { DrawingMode } from '../types'
import { BaseModel } from './base'
import { DrawModel } from './draw'
import { LineModel } from './line'

export function createModels(drauu: Drauu): Record<DrawingMode, BaseModel> {
  return {
    draw: new DrawModel(drauu),
    line: new LineModel(drauu),
  }
}
