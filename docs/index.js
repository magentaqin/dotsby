const config = {
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
        { method: 'get', relativeUrl: '/document/token' },
      ],
    },
    {
      section_title: 'User Api',
      dir: 'user',
      root_file: 'index.md',
      pages: [
      ]
    },
    {
      section_title: 'Account Api',
      dir: 'account',
      pages: []
    }
  ],
}

module.exports = config;