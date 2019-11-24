import React from 'react';

const CollapsePanel = ({ data }) => {

  const renderPanel = (data) => {
    return data.map((item, index) => {
      // console.log(item)
      let { displayName, type, description, required, example, properties } = item
      let enumText = item.enum;
      const hasJsonSchema = type.includes('type')
      if (hasJsonSchema) {
        const schemaItem = JSON.parse(item.type);
        type = schemaItem.type;
        const schemaProperties = []
        Object.keys(schemaItem.properties).forEach(prop => {
          schemaProperties.push({
            type: schemaItem.properties[prop].type,
            description: schemaItem.properties[prop].description,
            displayName: prop,
            key: prop,
            required: schemaItem.required.includes(prop)
          })
        })
        properties = schemaProperties
      }
      return (
        <div className="panel-item" key={index}>
          <div className="left-item">
            <p>{displayName === 'application/json' ? '' : displayName }</p>
            <p>{type}</p>
            <p>{description}</p>
          </div>
          <div className="right-item">
            <p>{required ? 'Required' : 'Optional'}</p>
            <p>{enumText}</p>
            <p>{example}</p>
          </div>
          {properties && properties.length ? renderPanel(properties) : null }
        </div>
      )
    })
  }
  return (
    <div className="collapse-panel-wrapper">
      {renderPanel(data)}
    </div>
  )
}

export default CollapsePanel;
