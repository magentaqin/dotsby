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
  if (!headers) { return [] }
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
    method,
  } = resource;
  const formattedPage = {
    title: page.displayName,
    request_url: relativeUri,
    method,
    request_headers: [],
    query_params: queryParameters || [],
    body: body || [],
    responses: [],
  }

  // format request headers
  const requestHeaders = formatRequestHeaders(resource, securitySchemes)
  formattedPage.request_headers = requestHeaders

  // format responses
  const securityResponses = []
  if (securitySchemes) {
    Object.keys(securitySchemes).forEach(key => {
      if (securitySchemes[key] && securitySchemes[key].describedBy && securitySchemes[key].describedBy.responses) {
        securitySchemes[key].describedBy.responses.forEach(res => {
          securityResponses.push({
            key: res.code,
            status: res.code,
            headers: res.headers ? res.headers : [],
            data: res.body,
            description: res.description,
          })
        })
      }
    })
  }

  const formattedResponses = responses.map(res => {
    const resHeaders = formatResponseHeaders(res.headers)
    return {
      key: res.key,
      status: res.code,
      headers: resHeaders,
      data: res.body,
    }
  })

  formattedPage.responses = [...formattedResponses, ...securityResponses];
  // console.log(formattedPage.responses)
  console.log(formattedPage.responses[1].data[0].properties[0].properties)

  return formattedPage;
}

const getApiContent = (apis, ramlPages, securitySchemes) => {
  return apis.map(api => {
    const { method, relativeUrl } = api;
    const matchedRamlPage = ramlPages.find(ramlPage => {
      return ramlPage.resource.method === method && ramlPage.resource.relativeUri === relativeUrl;
    })
    const formattedRamlPage = formatRamlPage(matchedRamlPage, securitySchemes)
    return formattedRamlPage;
  })
}

const transformApis = async (ramlFilePath, apis) => {
  let apiContent = {};
  const parsedResult = await ramlParser.parse(ramlFilePath).catch(err => console.log('parse raml file err', err))
  const ramlPages = ramlFormatter.getPages(parsedResult)
  apiContent = getApiContent(apis, ramlPages, parsedResult.securitySchemes)
  return apiContent;
}

export default transformApis;