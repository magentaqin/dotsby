import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  text-align: left;
  border-radius: 4px 4px 0 0;
  border-collapse: collapse;
`

const StyledHeader = styled.thead`
  background-color: ${props => props.theme.lightGrayColor};
`

const P = styled.p`
  line-height: 40px;
  font-size: ${props => props.theme.normalFont};
  padding-left: 8px;

`

const Row = styled.tr`
  border-top: 1px solid ${props => props.theme.dividerColor};
`

const Table = (props) => {
  const { tConfig, tData } = props;
  const renderTableHeaders = () => {
    return tConfig.map(item => {
      return (
        <th key={item.value}>
          <P>{item.label}</P>
        </th>
      )
    })
  }

  const renderRow = (row) => {
    return tConfig.map(config => {
      const value = row[config.value]
      const displayText = config.render ? config.render(value) : value
      return (
        <th key={config.value}>
          <P>{displayText}</P>
        </th>
      )
    })
  }

  const renderTbody = () => {
    return tData.map(row => {
      return (
        <Row className="tRow" key={row.key}>{renderRow(row)}</Row>
      )
    })
  }
  return (
    <StyledTable>
      <StyledHeader><tr>{renderTableHeaders()}</tr></StyledHeader>
      <tbody>{renderTbody()}</tbody>
    </StyledTable>
  )
}

export default Table;
