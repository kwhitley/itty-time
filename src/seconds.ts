import { ms } from './ms'
import { type TimeString } from 'lib/units'

export const seconds = (duration: TimeString | number): number =>
  ms(duration) / 1000
