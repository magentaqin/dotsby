#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const readline = require('readline-promise').default;

const Publisher = require('../lib');
const { loginApi } = require('../lib/request')
const { logError, logSuccess } = require('../lib/utils/logger')

const handleLogin = async () => {
  const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  const email = await rlp.questionAsync('Please input your email: ');
  if (email) {
    const password = await rlp.questionAsync('Please input your password: ');
    if (password) {
      const resp = await loginApi({ email, password }).catch(err => {
        let errMessage = 'Server Disconnected'
        errMessage = err.status === 400 ? 'Email format or password format is invalid.' : err.data.message;
        logError(errMessage)
      })
      return resp;
    }
  }
}

program.version('0.0.1');

program
  .command('publish')
  .description('publish the doc')
  .action(async () => {
    if (!program.args.length) {
      logError('Please specify your doc directory path.')
    }
    if (program.args.length > 1) {
      logError('Only one doc is allowed to publish at one time.')
    }
    const resp = await handleLogin();
    if (resp) {
      const docPath = path.resolve(process.cwd(), program.args[0])
      const publisher = new Publisher(docPath, resp.data.data.token)
      const result = await publisher.publish().catch(err => {
        logError(err);
      })
      if (result) {
        const { document_id, version } = result.data.data;
        logSuccess('Successfully Published.👏')
        logSuccess(`Please visit: http://docs.dotsby.cn/${document_id}?version=${version}`)
        process.exit(0);
      }
    }
  })

program.parse(process.argv)
