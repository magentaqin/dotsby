const path = require('path');
const { graphqlServer } = require(path.resolve(__dirname, './db'));
const config = require('./config');

graphqlServer
  .start(() => {
    console.log(`GraphQl server started at port ${config.config.port.graphqlServer}`)
  })
  .catch(err => logError(err));