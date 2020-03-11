const chalk = require('chalk')

const logError = (text) => {
  console.error(chalk.red(text))
  process.exit(-1)
}

const logWarning = (text) => {
  console.warn(chalk.yellow(text))
}

const logSuccess = (text) => {
  console.log(chalk.greenBright(text))
}

module.exports = {
  logError,
  logWarning,
  logSuccess,
}