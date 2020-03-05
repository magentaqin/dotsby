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
    let { description, pattern } = schemaItem.properties[prop];
    if (propType === 'array' && schemaItem.properties[prop].items.type === 'object') {
      propType = 'array<object>';
      const arrProperties = schemaItem.properties[prop].items.properties;
      Object.keys(arrProperties).forEach(ap => {
        const newAp = { ...arrProperties[ap] }
        newAp.displayName = ap;
        newAp.required = schemaItem.properties[prop].items.required.includes(ap)
        propProperties.push(newAp)
      })
    }

    if (propType === 'array' && schemaItem.properties[prop].items.type !== 'object') {
      propType = `array<${schemaItem.properties[prop].items.type}>`
      description = schemaItem.properties[prop].items.description;
      pattern = schemaItem.properties[prop].items.pattern;
    }

    let enumText = '';
    if (schemaItem.properties[prop].enum) {
      enumText = `enum: ${schemaItem.properties[prop].enum}`
    }

    schemaProperties.push({
      type: propType,
      description,
      displayName: prop,
      pattern,
      key: prop,
      enum: enumText,
      required: schemaItem.required.includes(prop),
      properties: propProperties,
    })
  })
  return schemaProperties;
}
