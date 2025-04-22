type StyleFunction<T = string> = (value: T) => typeof colored

type ColoredFunction = (...args: Array<any>) => void

type StyleMethods = {
  bold: typeof colored
  italic: typeof colored
  underline: typeof colored
  strikethrough: typeof colored
  color: StyleFunction
  bg: StyleFunction
  warn: typeof colored
  error: typeof colored
}

type ColoredProxy = {
  [key: string]: ColoredProxy // Allows dynamic colors or methods like "red", "green", etc.
} & StyleMethods & ColoredFunction

const ansiStyles: { [key: string]: string } = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  strikethrough: '\x1b[9m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
}

export const colored: ColoredProxy = new Proxy(() => {}, {
  get(
    _: any,
    prop: string,
    __: any,
    styles: Array<string> = [],
    which: string = 'log'
  ) {
    return new Proxy(
      (arg1: any, ...args: any[]) =>
        // @ts-ignore
        console[which](`${styles.join('')}${arg1}${ansiStyles.reset}`, ...args),
      {
        get(
          _: any,
          subProp: string,
          __: any,
          add = (style: string) => {
            if (ansiStyles[style]) styles.push(ansiStyles[style])
            return __
          }
        ) {
          if (subProp === 'bold') return add('bold')
          if (subProp === 'italic') return add('italic')
          if (subProp === 'underline') return add('underline')
          if (subProp === 'strikethrough') return add('strikethrough')
          if (subProp === 'color') return (value: string) => add(value) && __
          if (subProp === 'warn') return (which = 'warn') && __
          if (subProp === 'error') return (which = 'error') && __

          return add(subProp)
        },
      }
    )[prop]
  },
})

colored.bgRed.white('warning')
colored.strikethrough.magenta('warning')
colored.underline.yellow('warning')
colored.underline.orange('warning')