import { describe, expect, it } from 'bun:test'
import { datePlus } from './datePlus'
import { ms } from './ms'

describe('datePlus(duration: string, from?: Date): Date', () => {
  type DatePlusTest = [duration: string]

  const tests: DatePlusTest[] = [
    ['5 seconds'],
    ['1 minutes'],
    ['24 hour'],
    ['2 months'],
    ['4 years'],
    ['321 day'],
  ]

  describe('returns a Date object from the future', () => {
    for (const [duration] of tests) {
      const future = datePlus(duration)

      it(`datePlus('${duration}') => ${future.toISOString()}`, () => {
        const diff = (+future - Date.now()) - ms(duration)

        expect(diff).toBeLessThan(2)
      })
    }
  })

  describe('can take an optional second Date paramater', () => {
    for (const [duration] of tests) {
      const start = datePlus('1 week')
      const future = datePlus(duration, start)

      it(`datePlus('${duration}', datePlus('1 week')) => ${future.toISOString()}`, () => {
        const diff = (+future - +start) - ms(duration)

        expect(diff).toBeLessThan(2)
      })
    }
  })
})
