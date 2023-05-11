const consoleError = console.error
console.error = (...args) => {
  consoleError.call(console, ...args)
  throw new Error(args.join('\n'))
}

const consoleWarn = console.warn
console.warn = (...args) => {
  consoleWarn.call(console, ...args)
  throw new Error(args.join('\n'))
}
