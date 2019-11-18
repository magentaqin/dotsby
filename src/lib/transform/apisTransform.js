import path, { format } from 'path'
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

const formatRamlPage = (page, securitySchemes) => {
  const formattedPage = {
    title: page.displayName,
    request_url: page.resource.relativeUri,
    method: page.method,
    request_headers: [],
    params: [],
    responses: [],
    response_headers: [],
  }
  const { resource } = page;
  // console.log(resource)
  const requestHeaders = formatRequestHeaders(resource, securitySchemes)
  formattedPage.request_headers = requestHeaders

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
  // console.log(parsedResult.securitySchemes)
  const ramlPages = ramlFormatter.getPages(parsedResult)
  const apis = [
    { method: 'get', relativeUrl: '/document/token' },
  ]
  getApiContent(apis, ramlPages, parsedResult.securitySchemes)
}).catch(err => console.log('RAML ERR', err))
