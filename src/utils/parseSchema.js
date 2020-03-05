/* eslint-disable import/prefer-default-export */
import { isObject } from './obj';

export const getSchemaProperties = (schemaItem) => {
  const schemaProperties = []
  if (!isObject(schemaItem.properties)) {
    return schemaProperties;
  }
  Object.keys(schemaItem.properties).forEach(prop => {
    let propType = schemaItem.properties[prop].type;
    const propProperties = [];
    if (schemaItem.properties[prop].type === 'array' && schemaItem.properties[prop].items.type === 'object') {
      propType = 'array<object>';
      const arrProperties = schemaItem.properties[prop].items.properties;
      Object.keys(arrProperties).forEach(ap => {
        const newAp = { ...arrProperties[ap] }
        newAp.displayName = ap;
        newAp.required = schemaItem.properties[prop].items.required.includes(ap)
        propProperties.push(newAp)
      })
    }
    schemaProperties.push({
      type: propType,
      description: schemaItem.properties[prop].description,
      displayName: prop,
      key: prop,
      required: schemaItem.required.includes(prop),
      properties: propProperties,
    })
  })
  return schemaProperties;
}
