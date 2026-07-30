import { units, type TimeString } from './lib/units'

export type { TimeString, TimeUnit } from './lib/units'

// FUNCTION: get number of seconds from a duration string
export const ms = (duration: TimeString | number): number => {
  if (!isNaN(+duration)) return +duration

  // @ts-ignore
  const [, value, unit] = duration.match(/^([^ ]+) +(\w\w*?)s?$/) || [, duration]

  return +value * (units[unit] || 1)
}
