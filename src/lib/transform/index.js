/* eslint-disable import/prefer-default-export */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-empty */

import remark from 'remark';
import recommended from 'remark-preset-lint-recommended';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';

import { publishDocument } from '@src/service/request';
import { shallowOmit } from '@src/utils/obj';
import { logError } from '@src/utils/log';
import transformApis from './apisTransform';
import docConfig from '@docs';

const docRootPath = path.resolve(__dirname, '../../../docs');
const ramlFilePath = path.resolve(docRootPath, docConfig.raml_file)

// const getFileContent = async (path) => {
//   const data = await fs.promises.readFile(path, 'utf-8').catch(err => {
//     const filePath = JSON.parse(JSON.stringify(err)).path
//     logError(new Error(`Fail to read file content: ${filePath}`))
//   })
//   return data;
// }
// transform markdown to html.
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
          reject(err);
        }
        resolve(file.contents);
      });
  })
})

const getPageContents = async (pages, dir) => {
  const pageContents = []
  for (const page of pages) {
    const pagePath = path.resolve(docRootPath, `./${dir}/${page.file}`);
    const content = await transformMarkdownPromise(pagePath).catch(err => {
      console.log('Fail to transform markdown file to html: ', err);
    })
    if (content) {
      pageContents.push({
        title: page.title,
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
  const { document_id, title, version } = docConfig
  const params = {
    document_id,
    title,
    version,
    sections,
  }
  console.log('publish document params', params);
  return publishDocument(params)
}

const loopSections = async () => {
  const sections = [];
  for (const sectionConfig of docConfig.sections) {
    const {
      dir,
      pages,
      root_file,
      apis,
    } = sectionConfig;

    let sectionItem = {
      title: sectionConfig.title,
      pages: [],
    };

    /**
     * format customized pages
     */
    if (root_file) {
      const rootPath = path.resolve(docRootPath, `./${dir}/${root_file}`);
      const htmlContent = await transformMarkdownPromise(rootPath).catch(err => {
        console.log('Fail to transform markdown file to html: ', err);
      });
      if (htmlContent) {
        sectionItem.pages.push({
          title: dir,
          is_root_path: true,
          path: `/${dir}`,
          content: htmlContent,
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
          title,
          is_root_path: false,
          path: dir ? `/${dir}${childPath}` : childPath,
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


export const transform = () => {
  return new Promise(async(resolve, reject) => {
    let errMsg = '';
    const sections = await loopSections();
    if (!sections || !sections.length) {
      reject(new Error('Fail to parse config file.'))
    }
    const resp = await storeDocumentPromise(sections).catch(err => {
      if (err.status) {
        errMsg = JSON.stringify(err.data);
      } else {
        errMsg = 'Server Error';
      }
    })
    if (resp) {
      resolve(resp)
    } else {
      reject(new Error(`Fail to store document: ${errMsg}`))
    }
  })
}
