const config = {
  title: 'Dotsby Api Doc',
  version: '0.1.0',
  document_id: 'e887b814b1f859cb67911dc00c54de4f31d28f4b',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJlbWFpbCI6ImFmYTFAZ21haWwuY29tIiwiaWF0IjoxNTgxOTk2NTI2LCJleHAiOjE1ODQ1ODg1MjZ9.myYSe5JQ3lL_mJB30Pyzo7vVwZJz0kWdybfNQie1lpA',
  raml_file: 'api.raml',
  sections: [
    {
      title: 'Overview',
      dir: 'overview',
      pages: [
        { title: 'Overview', file: 'index.md', is_root_path: true },
        { title: 'FAQ', file: 'faq.md' },
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

export default config;