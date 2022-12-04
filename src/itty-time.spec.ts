import { describe, expect, it } from 'vitest'
import {
  datePlus,
  divide,
  getDuration,
  getSeconds,
} from './itty-time'

describe('itty-time', () => {
  describe('exports', () => {
    it('getDuration', () => {
      expect(typeof getDuration).toBe('function')
    })

    it('getSeconds', () => {
      expect(typeof getSeconds).toBe('function')
    })

    it('datePlus', () => {
      expect(typeof datePlus).toBe('function')
    })
  })

  describe('getDuration(duration: string): { value: number, unit: string }', () => {
    const tests = [
      ['5 seconds', { value: 5, unit: 'second' }],
      ['1 minutes', { value: 1, unit: 'minute' }],
      ['24 hour', { value: 24, unit: 'hour' }],
      ['321 day', { value: 321, unit: 'day' }],
      ['12 week', { value: 12, unit: 'week' }],
      ['3 month', { value: 3, unit: 'month' }],
      ['11 year', { value: 11, unit: 'year' }],
      ['1.5 minutes', { value: 1.5, unit: 'minute' }],
    ]

    it('is case insensitive', () => {
      const { value, unit} = getDuration('5 MinUte')

      expect(unit).toBe('minute')
    })

    it('returns value in { value: number, unit: string } format, such as { value: 12, unit: "minute" }', () => {
      const { value, unit} = getDuration('5 minutes')

      expect(value).toBe(5)
      expect(unit).toBe('minute')
    })

    describe('parses', () => {
      for (const [duration, expected] of tests) {
        it(`getDuration('${duration}') => ${JSON.stringify(expected).replace(/([:,])/g, '$1 ')}`, () => {
          expect(getDuration(duration)).toEqual(expected)
        })
      }
    })
  })

  describe('getSeconds(duration: string): number', () => {
    type SecondsTest = [duration: string, expected: number]

    const tests: SecondsTest[] = [
      ['5 seconds', 5],
      ['1 minutes', 60],
      ['24 hour', 60 * 60 * 24],
      ['1 day, 4 hours, and 36 minutes', 60 * 60 * 24 + 60 * 60 * 4 + 60 * 36],
      ['321 day', 60 * 60 * 24 * 321],
    ]

    describe('returns number of seconds', () => {
      for (const [duration, expected] of tests) {
        it(`getSeconds('${duration}') => ${expected}`, () => {
          expect(getSeconds(duration)).toEqual(expected)
        })
      }
    })
  })

  describe('datePlus(duration: string, from?: Date): Date', () => {
    type DatePlusTest = [duration: string]

    const tests: DatePlusTest[] = [
      ['5 seconds'],
      ['1 minutes'],
      ['24 hour'],
      ['1 day, 4 hours, and 36 minutes'],
      ['2 months'],
      ['4 years'],
      ['321 day'],
    ]

    describe('returns a Date object from the future', () => {
      for (const [duration] of tests) {
        const future = datePlus(duration)

        it(`datePlus('${duration}') => ${future.toISOString()}`, () => {

          const Seconds = getSeconds(duration)
          const diff = (+future - +new Date()) / 1000|0 - Seconds

          expect(diff).toBeLessThan(2)
        })
      }
    })

    describe('can take an optional second Date paramater', () => {
      for (const [duration] of tests) {
        const oneYearFromNow = datePlus('1 year')
        const future = datePlus(duration, oneYearFromNow)

        it(`datePlus('${duration}', datePlus('1 year')) => ${future.toISOString()}`, () => {

          const Seconds = getSeconds(duration)
          const diff = (+future - +oneYearFromNow) / 1000|0 - Seconds

          expect(diff).toBeLessThan(2)
        })
      }
    })
  })

  describe('divide(duration1: string).by(duration2: string): number', () => {
    it('divide(duration: string) returns an object with a single property, "by", in it', () => {
      const response = divide('1 day')

      expect(typeof response).toBe('object')
    })

    it('divide(duration: string).by is a function', () => {
      const response = divide('1 day')

      expect(typeof response.by).toBe('function')
    })

    type DivisionTest = [
      duration: string,
      divisor: string,
      result: number,
      fuzzy?: boolean,
    ]

    const tests: DivisionTest[] = [
      ['1 week', 'days', 7],
      ['2 minutes', 'second', 120],
      ['3 days', 'hour', 24 * 3],
      ['1 day', '3 hours', 8],
      ['1 year', 'month', 12, true],
      ['4 months', 'weeks', 4.25 * 4, true],
      ['3 minutes', 'seconds', 60 * 3],
      ['1 week', 'seconds', 60 * 60 * 24 * 7],
      ['24 hours', 'minutes', 60 * 24],
      ['3 days', 'hours', 24 * 3],
      ['1 day, 30 minutes', 'hours', 24 + 0.5],
      ['1 week', 'days', 7],
      ['12 hours', 'days', 0.5],
      ['3 months', 'days', 30.5 * 3, true],
      ['1 year', 'weeks', 52, true],
      ['1 month', 'weeks', 4.3, true],
      ['3 years', 'months', 36, true],
    ]

    describe('divides dates', () => {
      for (const [duration, divisor, expected, fuzzy] of tests) {
        it(`divide('${duration}').by('${divisor}') = ${fuzzy ? '~' : ''}${expected}`, () => {
          const value = divide(duration).by(divisor)

          if (fuzzy) {
            console.log('fuzzy comparing', value, 'to', expected)
            const proximity = Math.min(value, expected) / Math.max(value, expected)
            const closeEnough = proximity > 0.95
            expect(closeEnough).toBe(true)
          } else {
            expect(value).toBe(expected)
          }
        })
      }
    })
  })
})
