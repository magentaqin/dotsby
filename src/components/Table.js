import React from 'react';

const Table = (props) => {
  const { tConfig, tData } = props;
  const renderTableHeaders = () => {
    return tConfig.map(item => {
      return (
        <div key={item.value}>
          <p>{item.label}</p>
        </div>
      )
    })
  }

  const renderRow = (row) => {
    return tConfig.map(config => {
      const value = row[config.value]
      const displayText = config.render ? config.render(value) : value
      return (
        <div key={config.value}>
          <p>{displayText}</p>
        </div>
      )
    })
  }

  const renderTbody = () => {
    return tData.map(row => {
      return (
        <div className="tRow" key={row.key}>{renderRow(row)}</div>
      )
    })
  }
  return (
    <div>
      <div className="tHeaders">{renderTableHeaders()}</div>
      <div className="tBody">{renderTbody()}</div>
    </div>
  )
}

export default Table;
