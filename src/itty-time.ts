export type LengthOfTime = 'second' | 'seconds'
  | 'minute' | 'minutes'
  | 'hour' | 'hours'
  | 'day' | 'days'
  | 'week' | 'weeks'
  | 'month' | 'months'
  | 'year' | 'years';

type DurationSegment = `${number} ${LengthOfTime}` | `and ${number} ${LengthOfTime}`;


type CommaDuration<T extends string> = T extends DurationSegment
  ? T
  : T extends `${DurationSegment}, ${infer R}` ? T extends `${infer F}, ${R}`
    ? `${F}, ${Duration<R>}` : never : DurationSegment;

type OxfordDuration<T extends string> = T extends DurationSegment
  ? T
  : T extends `${DurationSegment} and ${infer R}` ? T extends `${infer F} and ${R}`
    ? `${F} and ${Duration<R>}` : never : DurationSegment;

export type Duration<T extends string> = CommaDuration<T> | OxfordDuration<T>;

// FUNCTION: get { value, unit } from a duration string
export const getDuration = <T extends string>(duration: Duration<T>) => {
  const match = duration.match(/^(?<strValue>[\d.]+)?\s?(?<unit>\w+?)s?$/)
  const { strValue, unit } = match.groups
  const value = +(strValue === undefined ? 1 : strValue)

  return { value, unit }
}

// FUNCTION: get future date from a duration string (e.g. getDatePlus('3 hours'))
export const getDatePlus =  <T extends string>(duration: Duration<T>) => {
  const durations = duration.split(/,?\s*and\s*|,\s*/)
  let next = new Date()

  for (const d of durations) {
    const { value, unit } = getDuration(d)
    const conversions = { 'Days': 'Date', 'Weeks': 'Date', 'Years': 'Month', 'Months': 'Month' }
    const multipliers = { 'Weeks': 7, 'Years': 12 }
    let capUnit = unit.charAt(0).toUpperCase() + unit.slice(1) + 's'
    const multiple = multipliers[capUnit] || 1
    capUnit = conversions[capUnit] || capUnit
    const [get, set] = [`get${capUnit}`, `set${capUnit}`]
    next = new Date(next[set](next[get]() + value * multiple))
  }

  return next
}

// FUNCTION: get number of seconds from a duration string
export const getTTL =  <T extends string>(duration: Duration<T>) => {
  const now = +(new Date)
  const next = +(getDatePlus(duration))

  return (next - now) / 1000|0
}

// HELPER FUNCTION: creates convenience methods below
export const divide = <T extends string>(duration: Duration<T>) => ({ by: <T extends string>(divisor: Duration<T>) => {
    const now = +(new Date()) / 1000|0
    const next = +(getDatePlus(duration)) / 1000|0
    const diff = next - now

    return diff / getTTL(divisor)
  }
})
