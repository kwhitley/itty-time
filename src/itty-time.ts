const units = {
  'year': 365 * 24 * 60 * 60,
  'month': 30 * 24 * 60 * 60,
  'week': 7 * 24 * 60 * 60,
  'day': 24 * 60 * 60,
  'hour': 60 * 60,
  'minute': 60,
  'second': 1,
}

// FUNCTION: get number of seconds from a duration string
export const getSeconds = (duration: string) => {
  const durations = duration.split(/,?\s*and\s*|,\s*/)
  const now = new Date().setMilliseconds(0)
  let next = now

  for (const d of durations) {
    const { value, unit } = getDuration(d)

    if (units[unit]) {
      next += units[unit] * value * 1000
    } else {
      const from = new Date(next)
      next = +new Date(from.setMonth(from.getMonth() + value * (unit === 'year' ? 12 : 1)))
    }
  }

  return (next - now) / 1000
}

// FUNCTION: get number of ms from a duration string
export const getMs = (duration: string) => getSeconds(duration) * 1000

// FUNCTION: get { value, unit } from a duration string
export const getDuration = (duration: string) => {
  const match = duration.toLowerCase().match(/^(?<strValue>[\d.]+)?\s?(?<unit>\w+?)s?$/)
  const { strValue, unit } = match.groups
  const value = +(strValue === undefined ? 1 : strValue)

  return { value, unit }
}

// FUNCTION: get future date from a duration string (e.g. getDatePlus('3 hours'))
export const datePlus = (duration: string, from?: Date): Date => {
  const next = from ? new Date(from) : new Date()

  return new Date(next.setSeconds(next.getSeconds() + getSeconds(duration)))
}

// HELPER FUNCTION: creates convenience methods below
export const divide = (duration: string) =>
  ({
      by: (divisor: string) => {
                                  const diff = getSeconds(duration)
                                  const diffBy = getSeconds(divisor)

                                  return diff / diffBy
                                }
  })

type DurationToStringOptions = {
  parts?: number
}

export const durationToString = (ms: number, options: DurationToStringOptions = {}) => {
  const {
    parts = -1,

  } = options
  const result = []
  ms = ms / 1000

  for (const [unit, value] of Object.entries(units)) {
    if (ms < value) continue
    const count = Math.floor(ms / value)
    ms -= count * value
    result.push(`${count} ${unit}${count > 1 ? 's' : ''}`)
    if (parts > 0 && result.length === parts) break
  }

  return result.join(', ')
}
