const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');

const { dbServer } = require(path.resolve(__dirname, '../db/index'));
const { createFile } = require(path.resolve(__dirname, '../db/request'));
const config = require('../config');
const { logError } = require('../utils/log');

//docs config
const docsPath = '../../docs';
const docRootPath = path.resolve(__dirname, docsPath, 'index.js');
const docConfig = require(docRootPath);
const { mainRoutes } = docConfig;

export const transform = () => {
  return new Promise((resolve) => {
    // bootstrap dbServer
    dbServer
    .start(async () => {
      console.log(`GraphQl server started at port ${config.config.port.dbServer}`)
      await loopMainRoutes();
      resolve();
    })
    .catch(err => logError(err));
  })
}

const loopMainRoutes = async () => {
  try {
    for (const mainRoute of mainRoutes) {
      const { name, dir, home, pages } = mainRoute;
      if (pages.length) {

      } else {
        const homePath = path.resolve(__dirname, docsPath, `./${dir}/${home}`);
        const file = await transformMarkdownPromise(homePath);
        if (file) {
          const storeFileSuccess = await storeFilePromise(file);
          if (storeFileSuccess) {
            console.log('successfully created file');
          }
        }
      }
    }
  } catch(err) {
    logError(err)
  }
}

function transformMarkdownPromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      remark()
        .use(recommended)
        .use(html)
        .process(data, function(err, file) {
          if (err) {
            return reject(err);
          }
          resolve(file);
        });
    })
  })
}

function storeFilePromise(file) {
  const params = {
    absolutePath: file.cwd,
    content: file.contents
  }
  return createFile(params);
}
