const logError = (err) => {
  console.error(err);
  process.exit(1);
}

module.exports = {
  logError
}
