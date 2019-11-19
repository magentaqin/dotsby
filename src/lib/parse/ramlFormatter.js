const toSchema = (o) => {
  if (o.properties) {
    let obj = {
      type: 'object',
      description: o.description || '',
      required: [],
      properties: {}
    }
    o.properties.forEach((p) => {
      obj.properties[p.key] = toSchema(p)
    })
    obj.required = Object.keys(obj.properties)
    return obj;
  } if (o.items) {
    let obj = {
      type: 'array',
      description: o.description || '',
      items: {}
    }
    if (o.items.content) {
      obj.items = JSON.parse(o.items.content)
    } else if (o.items.type && o.items.type.indexOf('$schema') > -1) {
      obj.items = JSON.parse(o.items.type)
    } else {
      obj.items = toSchema(o.items)
    }
    return obj;
  } if (o.content) {
    return JSON.parse(o.content)
  } if (o.type.indexOf('$schema') > -1) {
    return JSON.parse(o.type)
  }
  let obj = { type: o.type, description: o.description || ''};
  ['enum', 'example', 'examples'].forEach((property) => {
    if (o.hasOwnProperty(property)) {
      if (property === 'examples' && o[property].length === 1) {
        obj['example'] = o[property][0].structuredValue
      } else {
        obj[property] = o[property];
      }
    }
  })
  return obj;
}
/**
 * process through parsed raml object to get standard page array
 *
 * Page: {
 *   name,
 *   displayName,
 *   resource,
 * }
 * @return {Array}
 */
const getPages = (obj) => {
  const pages = [];
  // convert raml resource (one url one resource)
  // to page.resource (one url + http method one page.resource)
  if (!obj.resources) {
    return [];
  }
  obj.resources.forEach((res) => {
    res.methods.forEach((mes) => {
      // const uniqueId = res.uniqueId;
      // const name = uniqueId ? mes.method + '_' + uniqueId : mes.method + '_root';
      // Currently we don't use one uri for mutiple methods, so just use the uri as name
      let name = res.relativeUri.slice(1);
      if (name === '') {
        name = 'root';
      }

      mes.relativeUri = res.relativeUri;
      const displayName = mes.displayName ? mes.displayName : `${mes.method.toUpperCase()} ${mes.relativeUri}`;
      // mes.responses.forEach((child, cindex) => {
      //   if (child.body) {
      //     child.body.forEach((item, tindex) => {
      //       try {
      //         const schema = toSchema(item);
      //         item.jsonschema = JSON.stringify(schema);
      //       } catch (e) {
      //         console.error('convert error: ', e)
      //       }
      //     })
      //   }
      // })
      pages.push({
        name,
        displayName,
        resource: mes,
      });
    });
  });
  return pages;
}

module.exports = {
  getPages,
};
