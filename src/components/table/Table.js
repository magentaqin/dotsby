import React from 'react';

const Table = (tConfig, tData) => {
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
      return (
        <div key={config.value}>
          <p>{row[config.value]}</p>
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
