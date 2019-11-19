import path from 'path'
import ramlParser from '@src/lib/parse/ramlParser'
import ramlFormatter from '@src/lib/parse/ramlFormatter'

const ramlFilePath = path.resolve(__dirname, '../../../docs/api.raml')

const formatRequestHeaders = (resource, securitySchemes) => {
  let requestHeaders = []
  const { headers, securedBy } = resource
  if (headers) {
    requestHeaders = [...headers]
  }
  if (securedBy) {
    securedBy.forEach(item => {
      const key = item.schemeName;
      if (key && securitySchemes[key]) {
        securitySchemes[key].describedBy.headers.forEach(securityHeader => {
          requestHeaders.push(securityHeader)
        })
      }
    })
  }
  return requestHeaders;
}

const formatResponseHeaders = (headers) => {
  return headers.map(header => {
    if (header.examples) {
      const examples = header.examples.map(example => example.value);
      return {
        ...header,
        examples,
      }
    }
    return header;
  })
}

const formatRamlPage = (page, securitySchemes) => {
  const { resource } = page;
  const {
    relativeUri,
    queryParameters,
    body,
    responses,
  } = resource;
  const formattedPage = {
    title: page.displayName,
    request_url: relativeUri,
    method: page.method,
    request_headers: [],
    query_params: queryParameters,
    body,
    responses: [],
  }
  // console.log(responses)
  // format request headers
  const requestHeaders = formatRequestHeaders(resource, securitySchemes)
  formattedPage.request_headers = requestHeaders

  // format responses
  const formattedResponses = responses.map(res => {
    const resHeaders = formatResponseHeaders(res.headers)
    return {
      key: res.key,
      status: res.code,
      headers: resHeaders,
      data: res.body
    }
  })
  formattedPage.responses = formattedResponses

  return formattedPage;
}

const getApiContent = (apis, ramlPages, securitySchemes) => {
  apis.forEach(api => {
    const { method, relativeUrl } = api;
    const matchedRamlPage = ramlPages.find(ramlPage => {
      return ramlPage.resource.method === method && ramlPage.resource.relativeUri === relativeUrl;
    })
    formatRamlPage(matchedRamlPage, securitySchemes)
  })
}

ramlParser.parse(ramlFilePath).then(parsedResult => {
  const ramlPages = ramlFormatter.getPages(parsedResult)
  const apis = [
    { method: 'get', relativeUrl: '/document/token' },
  ]
  getApiContent(apis, ramlPages, parsedResult.securitySchemes)
}).catch(err => console.log('RAML ERR', err))
