#!/usr/bin/env node
const program = require('commander');
const path = require('path');

const Publisher = require('../lib')
const { logError } = require('../lib/utils/logger')

program.version('0.0.1');

program
  .command('publish')
  .description('publish the doc')
  .action(() => {
    if (!program.args.length) {
      logError('Please specify your doc directory path.')
    }
    if (program.args.length > 1) {
      logError('Only one doc is allowed to publish at one time.')
    }
    const docPath = path.resolve(process.cwd(), program.args[0])
    new Publisher(docPath).publish()
  })

program.parse(process.argv)