const config = {
  title: 'Dotsby Api Doc',
  version: '0.1.0',
  document_id: '3d0a78c6627ad4ff18775a462712ab375c5a7e38',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE1ODM0ODUxODcsImV4cCI6MTU4NjA3NzE4N30.D6AJMaZi-bhwj6kEP20Bn4BlGssDI0jb-nWqio5RU3Y',
  raml_file: 'api.raml',
  sections: [
    {
      title: 'Overview',
      dir: 'overview',
      pages: [
        { title: 'Introduction', file: 'introduction.md' },
        // { title: 'FAQ', file: 'faq.md' },
      ],
    },
    {
      title: 'User',
      apis: [
        { method: 'post', request_uri: '/user/signup' },
        { method: 'post', request_uri: '/user/login' },
        { method: 'post', request_uri: '/user/logout' },
        { method: 'get', request_uri: '/user/info' },
      ],
    },
    {
      title: 'Document',
      apis: [
        { method: 'post', request_uri: '/document/create' },
        { method: 'get', request_uri: '/document/list' },
        { method: 'post', request_uri: '/document/publish' },
        { method: 'get', request_uri: '/document' },
      ],
    },
    {
      title: 'Page',
      apis: [
        { method: 'get', request_uri: '/page' },
      ],
    },
    {
      title: 'query',
      apis: [
        { method: 'get', request_uri: '/query' },
      ],
    },
  ],
};

module.exports = config;