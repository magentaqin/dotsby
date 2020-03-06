const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3001',
  apiPrefix: '/api/v1',
  api: {
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 4000,
  },
}

export default config;
