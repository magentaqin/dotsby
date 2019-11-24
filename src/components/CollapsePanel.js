import React from 'react';

const CollapsePanel = (data) => {
  const renderPanel = (data) => {
    return data.map(item => {
      return (
        <div className="panel-item" key={item.key}>
          <div className="left-item">
            <p>{item.displayName + item.type }</p>
            <p>{item.description + item.title}</p>
          </div>
          <div className="right-item">
            <p>{item.required ? 'Required' : 'Optional'}</p>
            <p>{item.enum}</p>
            <p>{item.example}</p>
          </div>
          {item.properties && item.properties.length ? renderPanel(item.properties) : null }
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