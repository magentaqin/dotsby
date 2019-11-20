/* eslint-disable import/prefer-default-export */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-empty */

// import remark from 'remark';
// import recommended from 'remark-preset-lint-recommended';
// import html from 'remark-html';
import fs from 'fs';
import path from 'path';

import { createDocument } from '@src/server/request';
import { shallowOmit } from '@src/utils/obj';
import { logError } from '@src/utils/log';
import transformApis from './apisTransform';
import docConfig from '@docs';

const docRootPath = path.resolve(__dirname, '../../../docs');
const ramlFilePath = path.resolve(docRootPath, docConfig.ramlFile)

const getFileContent = async (path) => {
  const data = await fs.promises.readFile(path, 'utf-8').catch(err => {
    const filePath = JSON.parse(JSON.stringify(err)).path
    logError(new Error(`Fail to read file content: ${filePath}`))
  })
  return data;
}

const getPageContents = async (pages, dir) => {
  const pageContents = []
  for (const page of pages) {
    const pagePath = path.resolve(docRootPath, `./${dir}/${page.file}`);
    const content = await getFileContent(pagePath)
    if (content) {
      pageContents.push({
        page_title: page.title,
        is_root_path: false,
        path: `/${dir}`,
        content,
      })
    }
  }
  return pageContents
}

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

const loopSections = async () => {
  const sections = [];
  for (const sectionConfig of docConfig.sections) {
    const {
      section_title,
      dir,
      pages,
      root_file,
      apis,
    } = sectionConfig;

    let sectionItem = {
      section_title,
      pages: [],
    };

    /**
     * format customized pages
     */
    if (root_file) {
      const rootPath = path.resolve(docRootPath, `./${dir}/${root_file}`);
      const content = await getFileContent(rootPath)
      if (content) {
        sectionItem.pages.push({
          page_title: dir,
          is_root_path: true,
          path: `/${dir}`,
          content,
        })
      }
    }
    if (pages && pages.length) {
      const pageContents = await getPageContents(pages, dir)
      sectionItem.pages = [
        ...sectionItem.pages,
        ...pageContents,
      ]
    }

    if (apis && apis.length) {
      const apiContents = await transformApis(ramlFilePath, apis)
      const apiPages = apiContents.map((apiContent, index) => {
        const { title, request_url } = apiContent;
        const childPath = apis[index].path || request_url;
        return {
          page_title: title,
          is_root_path: false,
          path: `/${dir}${childPath}`,
          apiContent,
        }
      })
      sectionItem.pages = [
        ...sectionItem.pages,
        ...apiPages,
      ]
    }

    if (!sectionItem.pages.length) {
      sectionItem = shallowOmit(sectionItem, 'pages')
    }

    sections.push(sectionItem);
  }
  return sections;
}


// TODO: transform markdown to html. MOVE THIS TO SERVER SIDE.
// const transformMarkdownPromise = (filePath) => new Promise((resolve, reject) => {
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       return reject(err);
//     }
//     remark()
//       .use(recommended)
//       .use(html)
//       .process(data, (err, file) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(file);
//       });
//   })
// })


export const transform = () => {
  return new Promise(async(resolve, reject) => {
    let errMsg = '';
    const sections = await loopSections();
    if (!sections || !sections.length) {
      reject(new Error('Fail to parse config file.'))
    }
    const resp = await storeDocumentPromise(sections).catch(err => {
      errMsg = JSON.stringify(err.data);
    })
    if (resp) {
      resolve(resp)
    } else {
      reject(new Error(`Fail to store document: ${errMsg}`))
    }
  })
}
