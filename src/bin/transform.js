const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');

const { graphqlServer } = require(path.resolve(__dirname, '../db/index'));
const { createFile } = require(path.resolve(__dirname, '../db/request'));
const config = require('../config');
const { logError } = require('../utils/log');

//docs config
const docsPath = '../../docs';
const docRootPath = path.resolve(__dirname, docsPath, 'index.js');
const docConfig = require(docRootPath);
const { mainRoutes } = docConfig;

// bootstrap graphqlServer
graphqlServer
.start(() => console.log(`GraphQl server started at port ${config.config.port.graphqlServer}`))
.catch(err => logError(err));

for (let mainRoute of mainRoutes) {
  const { name, dir, home, pages } = mainRoute;
  if (pages.length) {

  } else {
    const homePath = path.resolve(__dirname, docsPath, `./${dir}/${home}`);
    transformMarkdown(homePath);
  }
}

function transformMarkdown(filePath) {
  fs.readFile(filePath, (err, data) => {
    if (!err) {
      remark()
      .use(recommended)
      .use(html)
      .process(data, function(err, file) {
        if (!err) {
          storeFile(file);

        } else {
          logError(err);
        }
      });
    } else {
      logError(err);
    }
  })
}

function storeFile(file) {
  const params = {
    absolutePath: file.cwd,
    content: file.contents
  }
  createFile(params).then((resp) => {
    console.log('successfully created file');
  }).catch(err => logError(err));
}