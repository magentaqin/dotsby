import path from 'path'
import ramlParser from '@src/lib/parse/ramlParser'
import ramlFormatter from '@src/lib/parse/ramlFormatter'

const ramlFilePath = path.resolve(__dirname, '../../../docs/api.raml')

const getApiContent = (apis, ramlPages) => {
  apis.forEach(api => {
    const { method, relativeUrl } = api;
    const matchedRamlPage = ramlPages.find(ramlPage => {
      return ramlPage.resource.method === method && ramlPage.resource.relativeUri === relativeUrl;
    })
    console.log(matchedRamlPage)
  })
}

ramlParser.parse(ramlFilePath).then(resp => {
  const ramlPages = ramlFormatter.getPages(resp)
  const apis = [
    { method: 'get', relativeUrl: '/document/token' },
  ]
  getApiContent(apis, ramlPages)
}).catch(err => console.log('RAML ERR', err))
