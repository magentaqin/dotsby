const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');
const { dbServer } = require(path.resolve(__dirname, '../db/index.js'));
const { createFile } = require(path.resolve(__dirname, '../db/request.js'));
const config = require('../config.js');

// bootstrap dbServer
dbServer
.start(() => console.log(`GraphQl server started at port ${config.config.port.graphqlServer}`))
.catch(err => console.error(err));


// dead file path. TODO
// const filePath = path.resolve(__dirname, '../../example/panda.md');

// fs.readFile(filePath, (err, data) => {
//   if (!err) {
//     remark()
//     .use(recommended)
//     .use(html)
//     .process(data, function(err, file) {
//       if (!err) {
//         // put html data to database. TODO
//         storeFile(file);

//         // bootstrap APP.TODO

//         // use graphql to ask for data. TODO

//         // serve side render. TODO.

//         // send back to client. TODO.

//       } else {
//         console.error(err);
//       }
//     });
//   } else {
//     console.error(err);
//   }
// })

// function storeFile(file) {
//   const params = {
//     absolutePath: file.cwd,
//     content: file.contents
//   }
//   createFile(params).then((resp) => {
//     console.log(resp.data)
//   }).catch(err => console.error(err));
// }