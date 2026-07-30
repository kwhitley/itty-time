import { ms } from './ms'
import { type TimeString } from './lib/units'

// FUNCTION: get future date from a duration string (e.g. datePlus('3 hours'))
export const datePlus = (duration: TimeString | number, from = new Date): Date =>
  new Date(from.getTime() + ms(duration))
