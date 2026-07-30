import { describe, expect, it } from 'bun:test'
import { datePlus } from './datePlus'
import { ms } from './ms'
import { seconds } from './seconds'
import { type TimeString } from './lib/units'

// The @ts-expect-error assertions below are verified by `bun run test:types`,
// since bun test does not type-check.
describe('TimeString type checking', () => {
  it('accepts every format the type allows', () => {
    const durations: [duration: TimeString, expected: number][] = [
      ['100', 100],
      ['100 ms', 100],
      ['100 millisecond', 100],
      ['100 milliseconds', 100],
      ['30.5 seconds', 30.5 * 1000],
      ['-30 minutes', -30 * 60 * 1000],
      ['1.5 hours', 1.5 * 60 * 60 * 1000],
      ['1 day', 24 * 60 * 60 * 1000],
      ['2 weeks', 2 * 7 * 24 * 60 * 60 * 1000],
      ['3 months', 3 * 30 * 24 * 60 * 60 * 1000],
      ['4 years', 4 * 365.25 * 24 * 60 * 60 * 1000],
    ]

    for (const [duration, expected] of durations) {
      expect(ms(duration)).toBe(expected)
      expect(seconds(duration)).toBe(expected / 1000)
      expect(+datePlus(duration, new Date(0))).toBe(expected)
    }
  })

  it('rejects invalid durations at compile time', () => {
    // @ts-expect-error - arbitrary strings are not valid durations
    expect(ms('lskdjfsdlkfjsdlfkjsd')).toBeNaN()

    // @ts-expect-error - duration values must be numeric
    expect(seconds('one hour')).toBeNaN()

    // unit typos silently fall back to ms at runtime - the type catches them
    // @ts-expect-error - unsupported units are rejected
    expect(ms('2 weekz')).toBe(2)

    // @ts-expect-error - unsupported units are rejected
    expect(+datePlus('2 apples', new Date(1000))).toBe(1002)
  })
})
