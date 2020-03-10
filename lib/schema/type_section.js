const commonProps = {
  title: {
    type: 'string',
    minLength: 1,
    format: 'ascii_printable',
    description: 'title of section',
  },
  dir: {
    type: 'string',
    minLength: 1,
    format: 'ascii_printable',
    description: 'directory to read markdown files',
  },
}

const sectionWithApiPage = {
  required: [
    'title',
    'apis',
  ],
  properties: {
   ...commonProps,
    apis: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'method',
          'request_uri',
        ],
        properties: {
          method: {
            type: 'string',
            minLength: 1,
            maxLength: 10,
            format: 'ascii_printable',
            description: 'request method',
          },
          request_uri: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            format: 'ascii_printable',
            description: 'request uri',
          },
          path: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            format: 'ascii_printable',
            description: 'route path for display',
          }
        }
      }
    }
  }
}

const sectionsWithCustomizedPage = {
  required: [
    'title',
    'dir',
    'pages',
  ],
  properties: {
    ...commonProps,
    pages: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'title',
          'file',
        ],
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            format: 'ascii_printable',
            description: 'title of page',
          },
          file: {
            type: 'string',
            minLength: 1,
            format: 'ascii_printable',
            description: 'filename to read',
          },
          is_root_path: {
            type: 'boolean',
            description: 'whether this file serves as index page',
          }
        }
      }
    }
  }
}

const schema = {
  type: 'object',
  oneOf: [
    sectionWithApiPage,
    sectionsWithCustomizedPage,
  ]
 }

module.exports = {
  schema,
}