
const { version_regx, raml_regx } = require('../utils/types');
const section = require('./type_section').schema;

const schema = {
  type: 'object',
  title: 'Config Template Schema',
  required: [
    'title',
    'version',
    'document_id',
    'token',
    'raml_file',
    'sections',
  ],
  properties: {
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      format: 'ascii_printable',
      description: 'title of document',
    },
    version: {
      type: 'string',
      pattern: version_regx,
      description: 'version of document',
    },
    document_id: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      format: 'ascii_printable',
      description: 'generated document id',
    },
    token: {
      type: 'string',
      minLength: 1,
      format: 'ascii_printable',
      description: 'user token',
    },
    raml_file: {
      type: 'string',
      pattern: raml_regx,
      description: 'raml file name'
    },
    sections: {
      type: 'array',
      description: 'config of sections',
      minItems: 1,
      items: section,
    }
  }
}

module.exports = {
  schema,
}