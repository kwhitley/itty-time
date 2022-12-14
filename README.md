# ![itty-time](https://user-images.githubusercontent.com/865416/197366211-0b93287c-50fb-4f2e-b78e-ff1a8aa7d635.png)

[![Version](https://img.shields.io/npm/v/itty-time.svg?style=flat-square)](https://npmjs.com/package/itty-time)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/itty-time?style=flat-square)](https://bundlephobia.com/result?p=itty-time)
![Build Status](https://img.shields.io/github/workflow/status/kwhitley/itty-time/build?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/github/kwhitley/itty-time/v0.x?style=flat-square)](https://coveralls.io/github/kwhitley/itty-time?branch=v0.x)
[![NPM Weekly Downloads](https://img.shields.io/npm/dw/itty-time?style=flat-square)](https://npmjs.com/package/itty-time)
[![Open Issues](https://img.shields.io/github/issues/kwhitley/itty-time?style=flat-square)](https://github.com/kwhitley/itty-time/issues)

[![Discord](https://img.shields.io/discord/832353585802903572?style=flat-square)](https://discord.com/channels/832353585802903572)
[![GitHub Repo stars](https://img.shields.io/github/stars/kwhitley/itty-time?style=social)](https://github.com/kwhitley/itty-time)
[![Twitter](https://img.shields.io/twitter/follow/kevinrwhitley.svg?style=social&label=Follow)](https://www.twitter.com/kevinrwhitley)

Tiny (~500 bytes) time math library for making date handling and TTLs within your APIs beautiful.

## Features

- Tiny @ ~500 bytes gzipped total, and tree-shakeable even further.
- Fully typed/TypeScript support
- Use plain text strings to describe time, not seconds/milliseconds
- Get TTLs
- Get future dates
- Divide durations

### WARNING - pre-release
This API, *specifically around the naming of exposed functions* may likely change in the next few days.  In the meantime, use/play at your own risk.  API changes will be broadcasted here and [on Discord](https://discord.com/channels/832353585802903572/1033783747809648680).

### CHANGELOG - pre-release
- **v0.1.x** to **v0.2.x** - renamed: `getTTL`-->`getSeconds`, `getDatePlus`-->`datePlus`, added optional "from" param to `datePlus`.
  ```ts
  // old
  getTTL('1 hour')
  // new
  getSeconds('1 hour')

  // old
  getDatePlus('1 hour')
  // new
  datePlus('1 hour')

  // added functionality
  datePlus('1 hour', optionalDate?: Date)
  ```
## Example

```js
import { getSeconds, divide, datePlus } from 'itty-time' // under 600 bytes

// Easily get TTL in seconds
getSeconds('3 hours') // 10800

// Complicated bits?  No problem.  (Oxford comma optional)
getSeconds('1 day, 4 hours, and 36 minutes') // 102960

// Need an expiration date?
datePlus('5 seconds') // 2022-10-22T23:10:11.824Z
datePlus('1 minutes') // 2022-10-22T23:11:06.824Z
datePlus('2 months') // 2022-12-23T00:11:58.534Z
datePlus('4 years') // 2026-10-22T23:11:58.534Z

// Want to find out how many X are in Y?
divide('1 week').by('days') // 7
divide('2 minutes').by('seconds') // 120
divide('3 days').by('hours') // 72
divide('1 day').by('3 hours') // 8
divide('1 week').by('seconds') // 604800
divide('24 hours').by('minutes') // 1440
divide('3 days').by('hours') // 72
divide('1 day, 30 minutes').by('hours') // 24.5
```

#### DISCLAIMER: This is a CONVENIENCE library for making short, readable code.

If you need absolute max performance for iterative work in a single thread, do the operations manually. That's always faster.

Otherwise, you'll probably never feel the difference, but your code sure will! <3

# API

### `getSeconds(duration: string): number`
Returns the number of seconds (as you typically need within a TTL) in the duration string.
```ts
getSeconds('3 hours') // 10800
getSeconds('1 day, 4 hours, and 36 minutes') // 102960
```

---

### `datePlus(duration: string, from?: Date): Date`
Adds a duration to a date (default is Date.now()), returning the future date.
```ts
datePlus('5 seconds') // 2022-10-22T23:10:11.824Z
datePlus('1 minutes') // 2022-10-22T23:11:06.824Z
datePlus('2 months') // 2022-12-23T00:11:58.534Z
datePlus('4 years') // 2026-10-22T23:11:58.534Z

// or from another date
datePlus('1 minutes', datePlus('1 year')) // 2023-10-22T23:11:06.824Z
```

---

### `divide(duration1: string).by(duration2: string): number`
Divides one duration by another, in a nice, readable manner.
```ts
divide('1 week').by('days') // 7
divide('2 minutes').by('seconds') // 120
divide('3 days').by('hours') // 72
divide('1 day').by('3 hours') // 8
divide('1 week').by('seconds') // 604800
divide('24 hours').by('minutes') // 1440
divide('3 days').by('hours') // 72
divide('1 day, 30 minutes').by('hours') // 24.5
```
