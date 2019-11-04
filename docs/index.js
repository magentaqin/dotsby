const config = {
  document_token: '1qazxsw2',
  doc_title: 'Example Doc Api',
  version: 0.1,
  sections: [
    {
      section_title: 'Overview', //default root file is index.md.
      dir: 'overview',
      pages: [] //TODO. READ FROM RAML AND SCHEMA
    },
    {
      section_title: 'User Api',
      dir: 'user',
      pages: []
    },
    {
      section_title: 'Account Api',
      dir: 'account',
      pages: []
    }
  ],
}

module.exports = config;