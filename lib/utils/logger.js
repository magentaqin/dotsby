const chalk = require('chalk')

const logError = (text) => {
  console.error(chalk.red(text))
  process.exit(-1)
}

const logWarning = (text) => {
  console.warn(chalk.yellow(text))
}

module.exports = {
  logError,
  logWarning,
}