import { units } from './lib/units'

// FUNCTION: get number of seconds from a duration string
export const ms = (duration: string | number): number => {
  if (+duration === duration) return +duration
  // @ts-ignore
  const [, value, unit] = duration.match(/^([^ ]+) +(\w\w*?)s?$/) || []

  return +value * (units[unit] || 1)
}
