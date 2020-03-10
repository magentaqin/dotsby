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
const { schema } = require('./schema/type_config')
const { extractErrMsg } = require('./utils/extract')
const { formatTitle } = require('./transform/formatTitle')
const transformApis = require('./transform/apisTransform')
const { logError } = require('./utils/logger')


const validator = new Validator();

const isPublishMode = true;

class Publisher {
  constructor(docPath) {
    this.docPath = docPath;
    this.docConfig = require(`${docPath}`);
  }

  publish = () => {
    return new Promise(async(resolve, reject) => {
      let errMsg = '';
      // validate config
      const validationResult = validator.validate(this.docConfig, schema);
      if (!validationResult.instance || validationResult.errors.length) {
        return reject(new Error(`Config file format is not valid: ${extractErrMsg(validationResult)}`))
      }

      const sections = await this.loopSections();
      if (!sections || !sections.length) {
        return reject(new Error('Fail to parse config file.'))
      }
      const resp = await this.storeDocumentPromise(sections).catch(err => {
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

  loopSections = async () => {
    const sections = [];
    for (const sectionConfig of this.docConfig.sections) {
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
        const pageContents = await this.getPageContents(pages, dir, this.docPath)
        sectionItem.pages = [
          ...sectionItem.pages,
          ...pageContents,
        ]
      }

      if (apis && apis.length) {
        const ramlFilePath = path.resolve(this.docPath, this.docConfig.raml_file);
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


  // store document to database.
  storeDocumentPromise = (sections) => {
    const { document_id, title, version, token } = this.docConfig
    const params = {
      document_id,
      title,
      version,
      sections,
    }
    console.log('publish document params', params);
    return publishDocument(params, token)
  }

  getPageContents = async (pages, dir) => {
    const pageContents = []
    for (const page of pages) {
      const pagePath = path.resolve(this.docPath, `./${dir}/${page.file}`);
      let content;
      if (isPublishMode) {
        content = await this.getFileContent(pagePath);
      } else {
        content = await this.transformMarkdownPromise(pagePath).catch(err => {
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

  // transform markdown to html.
  transformMarkdownPromise = (filePath) => new Promise((resolve, reject) => {
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

  getFileContent = async (path) => {
    const data = await fs.promises.readFile(path, 'utf-8').catch(err => {
      const filePath = JSON.parse(JSON.stringify(err)).path
      logError(new Error(`Fail to read file content: ${filePath}`))
    })
    return data;
  }
}

module.exports = Publisher;