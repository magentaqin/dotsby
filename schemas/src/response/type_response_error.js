const schema = {
  title: 'response error',
  additionalProperties: false,
  type: 'object',
  required: [
    'code',
    'message',
  ],
  properties: {
    code: {
      type: 'string',
      description: 'A string represents the type of the error',
      example: 'INVALID_PARAMETERS',
    },
    message: {
      type: 'string',
      description: 'The human readable message for the error',
      example: 'account_id invalid: format error',
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'code',
          'message',
        ],
        properties: {
          code: {
            type: 'string',
            description: 'A string represents the type of the error',
            example: 'INVALID_USER_ID',
          },
          message: {
            type: 'string',
            description: 'The human readable message for the error',
            example: 'account_id invalid: format error',
          },
        },
      },
      description: 'Optional, when the error contains structured details, for example `1003` Invalid API Parameter, the `errors` array will be used to store errors of the request validation',
    },
  },
}

module.exports = {
  schema,
}
