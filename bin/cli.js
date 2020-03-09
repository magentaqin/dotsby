#!/usr/bin/env node
const program = require('commander');
const { publish } = require('../lib')

program.version('0.0.1');

program
  .option('-d, --dir', 'Api Doc Directory')

program.parse(process.argv);
console.log(program.args)

publish()