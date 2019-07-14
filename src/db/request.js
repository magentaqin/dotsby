const axios = require('axios');
const baseURL = `http://localhost:4000`;

const httpRequest = axios.create({
  baseURL,
  timeout: 3000
})

const createFile = (params) => {
  const absolutePath = JSON.stringify(params.absolutePath);
  const content = JSON.stringify(params.content);
  const query = `
    mutation {
      create(
        absolutePath: ${absolutePath}
        content: ${content}
      ){
        id,
        absolutePath,
        content
      }
    }
  `
  return httpRequest.post('/', { query });
}

module.exports = {
  createFile
};