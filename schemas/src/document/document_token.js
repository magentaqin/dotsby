const schema = {
  type: 'object',
  title: 'Get Document Token',
  required: [
    'document_token',
  ],
  properties: {
    document_token: {
      type: 'number',
      minimum: 1,
      description: 'auto increment document id',
    },
  },
}

module.exports = {
  schema,
};
