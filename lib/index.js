/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
const remark = require('remark')
const recommended = require('remark-preset-lint-recommended')
const html = require('remark-html')
const fs = require('fs')
const path = require('path')
const { Validator } = require('jsonschema')
const { publishDocument } = require('./request')
const { shallowOmit } = require('./utils/obj')
const { schema } = require('../dotsby-schema/src/config/type_config')
const { extractErrMsg } = require('./utils/extract')
const { formatTitle } = require('./transform/formatTitle')
const transformApis = require('./transform/apisTransform')
const { logError } = require('./utils/log')

const docConfig = require('../docs')


// TODO. READ FROM CURRENT DIRECTORY.
const docRootPath = path.resolve(__dirname, '../docs');
console.log(__dirname)
const validator = new Validator();

const isPublishMode = true;

const getFileContent = async (path) => {
  const data = await fs.promises.readFile(path, 'utf-8').catch(err => {
    const filePath = JSON.parse(JSON.stringify(err)).path
    logError(new Error(`Fail to read file content: ${filePath}`))
  })
  return data;
}

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
    let content;
    if (isPublishMode) {
      content = await getFileContent(pagePath);
    } else {
      content = await transformMarkdownPromise(pagePath).catch(err => {
        console.log('Fail to transform markdown file to html: ', err);
      })
      content = formatTitle(content);
    }
    if (content) {
      pageContents.push({
        title: page.title,
        is_root_path: !!page.is_root_path,
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
  console.log('publish document params', params.sections[4].pages[0].apiContent.query_params);
  return publishDocument(params, docConfig.token)
}

const loopSections = async () => {
  const sections = [];
  for (const sectionConfig of docConfig.sections) {
    const {
      dir,
      pages,
      apis,
    } = sectionConfig;

    let sectionItem = {
      title: sectionConfig.title,
      pages: [],
    };

    /**
     * format customized pages
     */
    if (pages && pages.length) {
      const pageContents = await getPageContents(pages, dir)
      sectionItem.pages = [
        ...sectionItem.pages,
        ...pageContents,
      ]
    }

    if (apis && apis.length) {
      const ramlFilePath = path.resolve(docRootPath, docConfig.raml_file);
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


const publish = () => {
  return new Promise(async(resolve, reject) => {
    let errMsg = '';
    // validate config
    const validationResult = validator.validate(docConfig, schema);
    if (!validationResult.instance || validationResult.errors.length) {
      return reject(new Error(`Config file format is not valid: ${extractErrMsg(validationResult)}`))
    }

    const sections = await loopSections();
    if (!sections || !sections.length) {
      return reject(new Error('Fail to parse config file.'))
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

module.exports = {
  publish,
}