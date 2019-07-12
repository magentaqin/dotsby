const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');

// dead file path. TODO
const filePath = path.resolve(__dirname, '../../example/panda.md');

fs.readFile(filePath, (err, data) => {
  if (!err) {
    remark()
    .use(recommended)
    .use(html)
    .process(data, function(err, file) {
      if (!err) {
        console.log('data', file);
        // put html data to database. TODO
        storeFile(file);

        // bootstrap APP.TODO

        // use graphql to ask for data. TODO

        // serve side render. TODO.

        // send back to client. TODO.

      } else {
        console.error(err);
      }
    });
  } else {
    console.error(err);
  }
})

function storeFile(file) {

}