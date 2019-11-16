const remark = require('remark');
const recommended = require('remark-preset-lint-recommended');
const html = require('remark-html');
const fs = require('fs');
const path = require('path');

const { createDocument } = require('@src/server/request.js');
const { logError } = require('@src/utils/log');

// docs config
const docsPath = '../../docs';
const docRootPath = path.resolve(__dirname, docsPath);
const docConfig = require(docRootPath);

export const transform = () => new Promise(async(resolve) => {
  const sections = await loopMainRoutes();
  console.log(JSON.stringify(sections))
  const resp = await storeDocumentPromise(sections)
  resolve(resp);
})

const loopMainRoutes = async () => {
  const sections = [];
  try {
    for (const sectionConfig of docConfig.sections) {
      const {
        section_title, dir, pages, root_file,
      } = sectionConfig;
      const sectionItem = {
        section_title,
        pages: [],
      };
      if (root_file) {
        const rootPath = path.resolve(docRootPath, `./${dir}/${root_file}`);
        const htmlFile = await transformMarkdownPromise(rootPath)
        const { contents } = htmlFile;
        if (htmlFile) {
          sectionItem.pages.push({
            page_title: '',
            is_root_path: true,
            path: `/${dir}`,
            content: contents,
          })
        }
      }

      if (pages && pages.length) {

      }

      sections.push(sectionItem);
      return sections;
    }
  } catch (err) {
    logError(err)
  }
}

// transform markdown to html
const transformMarkdownPromise = (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return reject(err);
    }
    remark()
      .use(recommended)
      .use(html)
      .process(data, (err, file) => {
        if (err) {
          return reject(err);
        }
        resolve(file);
      });
  })
})

// store document to database.
const storeDocumentPromise = (sections) => {
  const { document_token, doc_title, version } = docConfig
  const params = {
    document_token,
    doc_title,
    version,
    sections,
  }
  return createDocument(params)
}
