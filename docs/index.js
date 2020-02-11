const config = {
  title: 'Dotsby Api Doc',
  version: '0.1.0',
  document_id: 'e887b814b1f859cb67911dc00c54de4f31d28f4b',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJlbWFpbCI6ImFmYTFAZ21haWwuY29tIiwiaWF0IjoxNTc5MzU2Mzg2LCJleHAiOjE1ODE5NDgzODZ9._TusMMfMuFk_GxTEjHRCZXMviGdB7I_htm3SDOAq84o',
  raml_file: 'api.raml',
  sections: [
    {
      title: 'Overview',
      dir: 'overview',
      root_file: 'index.md',
      pages: [
        { title: 'FAQ', file: 'faq.md' },
      ],
    },
    {
      title: 'User',
      apis: [
        {
          method: 'post',
          request_uri: '/user/signup',
          // path: '/user/signup/', // path is the page route displayed on doc. optional.
        },
      ],
    },
  ],
};

export default config;
