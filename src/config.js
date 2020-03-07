const config = {
  host: process.env.REACT_APP_HOST || 'localhost',
  port: process.env.REACT_APP_PORT || '3001',
  apiPrefix: '/api/v1',
  api: {
    host: process.env.REACT_APP_API_HOST || 'localhost',
    port: process.env.REACT_APP_API_PORT || 4000,
  },
}

export default config;
