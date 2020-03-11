const axios = require('axios')
const qs = require('qs')

const host = process.env.API_HOST || 'localhost';
const port = process.env.API_PORT || 4000;

const client = axios.create({
  baseURL: `http://${host}:${port}/api/v1`,
  headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
  responseType: 'json',
  timeout: 20000,
})

const request = (url, method, data, headerData = {}) => {
  const headers = { ...headerData }
  const options = {
    url,
    method,
    headers,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  }

  if (method === 'GET') {
    options.params = data;
  } else {
    options.data = data;
  }

  const requestPromise = new Promise((resolve, reject) => {
    client.request(options).then((resp) => {
      resolve(resp)
    }).catch(error => {
      const formattedError = {
        method: error.config.method,
        url: error.config.url,
        status: error.response ? error.response.status : '',
        statusText: error.response ? error.response.statusText : '',
        data: error.response ? error.response.data : '',
        raw: error,
      };
      reject(formattedError)
    })
  })

  return requestPromise;
}

const http = {
  get: (url, data, headerData = {}) => request(url, 'GET', data, headerData),
  post: (url, data, headerData = {}) => request(url, 'POST', data, headerData),
}



const publishDocument = async(query, token) => {
  const resp = await http.post('/document/publish', query, { Authorization: token });
  return resp;
}

const loginApi = async(query) => {
  const resp = await http.post('/user/login', query);
  return resp;
}

module.exports = {
  publishDocument,
  loginApi,
}