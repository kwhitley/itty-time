// FUNCTION: get { value, unit } from a duration string
export const getDuration = (duration: string) => {
  const match = duration.match(/^(?<strValue>[\d.]+)?\s?(?<unit>\w+?)s?$/)
  const { strValue, unit } = match.groups
  const value = +(strValue === undefined ? 1 : strValue)

  return { value, unit }
}

// FUNCTION: get future date from a duration string (e.g. getDatePlus('3 hours'))
export const datePlus = (duration: string, from?: Date) => {
  const durations = duration.split(/,?\s*and\s*|,\s*/)
  let next = from || new Date()

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

// HELPER FUNCTION: creates convenience methods below
export const divide = (duration: string) => ({ by: (divisor: string) => {
    const now = +new Date()
    const diff = +datePlus(duration) - now
    const diffBy = +datePlus(divisor) - now

    return diff / diffBy
  }
})

// FUNCTION: get number of seconds from a duration string
export const getSeconds = (duration: string) => divide(duration).by('seconds')
