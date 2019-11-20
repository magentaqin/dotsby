const config = {
  ramlFile: 'api.raml',
  user_token: 'dfjakjdfkajdfkj123',
  document_token: '1qazxsw2',
  doc_title: 'Dotsby Api Doc',
  version: 0.1,
  sections: [
    {
      section_title: 'Overview',
      dir: 'overview',
      root_file: 'index.md',
      pages: [], // for customized md file
      apis: [
        // path is the page route displayed on doc. Optional.
        {
          method: 'get',
          relativeUrl: '/document/token',
          path: '/document-token',
        },
      ],
    },
    {
      section_title: 'User Api',
      dir: 'user',
      root_file: 'index.md',
      pages: [
        { title: 'Update Notices', file: 'update.md' },
      ],
    },
    {
      section_title: 'Account Api',
      dir: 'account',
    },
  ],
}

export default config;
