const axios = require('axios')
const config = require('config')

const client = axios.create({
  baseURL: `http://localhost:${config.port.dbServer}/api/v1`,
  headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' },
  withCredentials: true,
  responseType: 'json',
  timeout: 20000,
})

const request = async(url, method, data, headerData = {}) => {
  const headers = { ...headerData }
  const options = {
    url,
    method,
    data,
    headers,
  }

  try {
    const resp = await client.request(options)
    return resp
  } catch (err) {
    if (err.response) {
      return {
        status: err.response.status,
        data: err.response.data,
      }
    }
    return {
      status: 500,
      data: {
        code: 'SERVER_ERROR',
        message: 'Server is not available now.',
      },
    }
  }
}

const http = {
  get: (url, data, headerData = {}) => request(url, 'GET', data, headerData),
  post: (url, data, headerData = {}) => request(url, 'POST', data, headerData),
}

const createDocument = async(query) => {
  const resp = await http.post('/document/createDocument', query);
  return resp;
}

const getDocumentInfo = async(query) => {
  const resp = await http.get('/document/getDocumentInfo', query)
  return resp;
}

module.exports = {
  createDocument,
  getDocumentInfo,
}
