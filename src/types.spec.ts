import { describe, expect, it } from 'bun:test'
import { datePlus } from './datePlus'
import { ms } from './ms'
import { seconds } from './seconds'
import { type TimeString } from './lib/units'

// The @ts-expect-error assertions below are verified by `bun run test:types`,
// since bun test does not type-check.
describe('TimeString type checking', () => {
  it('accepts every format the type allows', () => {
    const durations: TimeString[] = [
      '100',
      '100 ms',
      '100 millisecond',
      '100 milliseconds',
      '30.5 seconds',
      '-30 minutes',
      '1.5 hours',
      '1 day',
      '2 weeks',
      '3 months',
      '4 years',
    ]

    for (const duration of durations) {
      expect(ms(duration)).not.toBeNaN()
      expect(seconds(duration)).not.toBeNaN()
      expect(+datePlus(duration)).not.toBeNaN()
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
