import path from 'path'
import ramlParser from '@src/lib/parse/ramlParser'
import ramlFormatter from '@src/lib/parse/ramlFormatter'

const ramlFilePath = path.resolve(__dirname, '../../docs/api.raml')

ramlParser.parse(ramlFilePath).then(resp => {
  const ramlPages = ramlFormatter.getPages(resp)
  console.log(JSON.stringify(ramlPages))
}).catch(err => console.log('RAML ERR', err))
